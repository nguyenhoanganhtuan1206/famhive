import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions } from 'typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user.entity';

export class GetUsersCommand implements ICommand {
  constructor(public readonly options: FindManyOptions<UserEntity>) {}
}

@CommandHandler(GetUsersCommand)
export class GetUsersHandler
  implements ICommandHandler<GetUsersCommand, UserEntity[]>
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: GetUsersCommand): Promise<UserEntity[]> {
    return this.userRepository.find({ ...command.options });
  }
}
