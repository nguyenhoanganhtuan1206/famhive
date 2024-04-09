import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { getLastsMinutes } from '../../utils/date.utils';
import { generateCode } from '../../utils/string.utils';
import { SendMailCommand } from '../mailer/commands/send-mail.command';
import { UserEntity } from '../user/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { ForgotEntity } from './entities/forgot.entity';

@Injectable()
export class ForgotService {
  constructor(
    @InjectRepository(ForgotEntity)
    private forgotRepository: Repository<ForgotEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const userEntity = await this.findUserByEmail(resetPasswordDto.email);
    const existingForgotEntity = await this.findByUserId(userEntity.id);

    if (
      existingForgotEntity === null ||
      getLastsMinutes(existingForgotEntity.createdAt) > 60 ||
      resetPasswordDto.code !== existingForgotEntity.code
    ) {
      throw new BadRequestException('Your code is invalid of expired');
    }

    userEntity.password = resetPasswordDto.password;

    await this.userRepository.save(userEntity);
    await this.forgotRepository.delete(existingForgotEntity.id);
  }

  @Transactional()
  async sendCode(sendCodeDto: SendCodeDto) {
    const userEntity = await this.findUserByEmail(sendCodeDto.email);
    const existingForgotEntity = await this.findByUserId(userEntity.id);

    if (
      existingForgotEntity !== null &&
      getLastsMinutes(existingForgotEntity.createdAt) <= 3
    ) {
      throw new BadRequestException(
        'Please wait for 3 minutes before sending a new one',
      );
    }

    const forgotEntity = this.updateOrCreate(
      existingForgotEntity,
      userEntity.id,
      generateCode(),
    );

    // send email
    await this.commandBus.execute(
      new SendMailCommand({
        to: userEntity.email,
        templateName: 'reset-password',
        data: {
          fullName: userEntity.fullName,
          code: forgotEntity.code,
        },
      }),
    );

    await this.forgotRepository.save(forgotEntity);
  }

  private updateOrCreate(
    forgot: ForgotEntity | null,
    userId: Uuid,
    code: string,
  ) {
    const createdAt = new Date();

    if (forgot === null) {
      return this.forgotRepository.create({
        userId,
        code,
        createdAt,
      });
    }

    return {
      ...forgot,
      code,
      createdAt,
    };
  }

  private findByUserId(userId: Uuid) {
    return this.forgotRepository.findOneBy({ userId });
  }

  private findUserByEmail(email: string) {
    return this.userRepository.findOneByOrFail({ email });
  }
}
