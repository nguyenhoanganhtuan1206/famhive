import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { EventService } from '../event.service';

export class DeleteBirthdayByUsersCommand implements ICommand {
  constructor(public userIds: Uuid[]) {}
}

@CommandHandler(DeleteBirthdayByUsersCommand)
export class DeleteBirthdayByUsersHandler
  implements ICommandHandler<DeleteBirthdayByUsersCommand, void>
{
  constructor(private readonly eventService: EventService) {}

  async execute(command: DeleteBirthdayByUsersCommand) {
    await this.eventService.deleteBirthdayByUsers(command.userIds);
  }
}
