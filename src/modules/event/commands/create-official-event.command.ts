import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { RecurringType } from '../../../constants/recurring-type';
import type { UserEntity } from '../../user/user.entity';
import { EventService } from '../event.service';
import { EventType } from '../types/event.type';

export class CreateOfficialEventCommand implements ICommand {
  constructor(public readonly user: UserEntity) {}
}

@CommandHandler(CreateOfficialEventCommand)
export class CreateOfficialEventHandler
  implements ICommandHandler<CreateOfficialEventCommand, void>
{
  constructor(private readonly eventService: EventService) {}

  async execute(command: CreateOfficialEventCommand): Promise<void> {
    const defaultEvents = [
      {
        title: 'National Spouses Day',
        date: new Date('2000-01-26'),
      },
      {
        title: `💝 Valentine's Day`,
        date: new Date('2000-02-14'),
      },
      {
        title: `International Women's Day`,
        date: new Date('2000-03-08'),
      },
      {
        title: 'International Day of Happiness',
        date: new Date('2000-03-20'),
      },
      {
        title: 'International Day of Families',
        date: new Date('2000-05-15'),
      },
    ];

    await Promise.all(
      defaultEvents.map((task) =>
        this.eventService.create(command.user, {
          title: task.title,
          eventType: EventType.OFFICIAL,
          isRecurring: true,
          recurringType: RecurringType.YEARLY,
          isAllday: true,
          startDateTime: task.date,
        }),
      ),
    );
  }
}
