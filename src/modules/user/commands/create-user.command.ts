import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user.entity';

export class CreateUserCommand implements ICommand {
  constructor(public readonly user: UserEntity) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  execute(command: CreateUserCommand) {
    return this.userRepository.save(this.userRepository.create(command.user));
  }
}
