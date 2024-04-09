import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { UserEntity } from '../user.entity';
import { UserService } from '../user.service';

export class GetAdminsActivatedByListFamilyIdsCommand implements ICommand {
  constructor(public readonly familyIds: Uuid[]) {}
}

@CommandHandler(GetAdminsActivatedByListFamilyIdsCommand)
export class GetAdminsActivatedByListFamilyIdsHandler
  implements
    ICommandHandler<GetAdminsActivatedByListFamilyIdsCommand, UserEntity[]>
{
  constructor(private userService: UserService) {}

  execute(command: GetAdminsActivatedByListFamilyIdsCommand) {
    return this.userService.getAdminsActivatedByFamilyIds(command.familyIds);
  }
}
