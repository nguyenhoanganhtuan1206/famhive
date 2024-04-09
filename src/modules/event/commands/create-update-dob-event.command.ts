import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import _ from 'lodash';

import { RecurringType } from '../../../constants/recurring-type';
import type { UserEntity } from '../../user/user.entity';
import type { CreateEventDto } from '../dto/create-event.dto';
import type { EventEntity } from '../entities/event.entity';
import { EventService } from '../event.service';
import { EventType } from '../types/event.type';

export class CreateUpdateDobEventCommand implements ICommand {
  constructor(public readonly user: UserEntity) {}
}

@CommandHandler(CreateUpdateDobEventCommand)
export class CreateUpdateDobEventHandler
  implements ICommandHandler<CreateUpdateDobEventCommand, void>
{
  constructor(private readonly eventService: EventService) {}

  async execute(command: CreateUpdateDobEventCommand): Promise<void> {
    if (command.user.birthday) {
      const events = await this.eventService.findByEventType(
        command.user.id,
        EventType.BIRTHDAY,
      );
      const birthdayEvent = _.first(events);

      if (birthdayEvent) {
        // update event
        await this.eventService.updateEvent(command.user, birthdayEvent.id, {
          title: `🎂 ${command.user.fullName}'s Birthday`,
          startDateTime: new Date(command.user.birthday),
        });

        return;
      }

      // create new event
      const dobEvent: Partial<EventEntity> & CreateEventDto = {
        title: `🎂 ${command.user.fullName}'s Birthday`,
        isRecurring: true,
        recurringType: RecurringType.YEARLY,
        isAllday: true,
        startDateTime: new Date(command.user.birthday),
        assigneeIds: [command.user.id],
        eventType: EventType.BIRTHDAY,
      };
      await this.eventService.create(command.user, dobEvent);
    }
  }
}
