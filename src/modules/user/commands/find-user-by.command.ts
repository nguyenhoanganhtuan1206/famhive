import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { FindOptionsWhere } from 'typeorm';

import type { UserEntity } from '../user.entity';
import { UserService } from '../user.service';

export class FindUsersByCommand implements ICommand {
  constructor(public readonly where: FindOptionsWhere<UserEntity>) {}
}

@CommandHandler(FindUsersByCommand)
export class FindUsersByHandler
  implements ICommandHandler<FindUsersByCommand, UserEntity[]>
{
  constructor(private userService: UserService) {}

  execute(command: FindUsersByCommand) {
    return this.userService.findUserBy(command.where);
  }
}
