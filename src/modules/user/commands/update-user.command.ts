import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user.entity';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly user: Partial<UserEntity>,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements ICommandHandler<UpdateUserCommand, UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: command.userId },
    });

    return this.userRepository.save({
      ...user,
      ...command.user,
    });
  }
}
