import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';
import type { UserEntity } from 'modules/user/user.entity';
import { RRule } from 'rrule';
import { Brackets, ILike, In, Repository } from 'typeorm';

import type { ISendFirebaseMessages } from '../../shared/services/notification.service';
import { NotificationsService } from '../../shared/services/notification.service';
import {
  addHours,
  addMinutes,
  endOfDay,
  isDateInRange,
  startOfDay,
} from '../../utils/date.utils';
import { calculateRruleString } from '../../utils/rrule.utils';
import { GetDeviceTimeZoneOffsetByUserIdCommand } from '../device/commands/get-device-time-zone-offset-by-user-id.command';
import { FindUsersByCommand } from '../user/commands/find-user-by.command';
import type { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import type { GetEventsDto } from './dto/get-events.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventType } from './types/event.type';

const MINUTES_ALERT_BEFORE = 15;

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private notificationService: NotificationsService,
    private commandBus: CommandBus,
  ) {}

  async create(
    user: UserEntity,
    createEventDto: Partial<EventEntity> & CreateEventDto,
  ): Promise<EventEntity> {
    let assignees: UserEntity[] = [];

    // todo: remove later
    // support for old version
    if (createEventDto.assigneeId) {
      createEventDto.assigneeIds = [createEventDto.assigneeId];
    }

    // check and get assignees
    if (createEventDto.assigneeIds && createEventDto.assigneeIds.length > 0) {
      assignees = await this.findAssignees(createEventDto.assigneeIds);
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      familyId: user.familyId,
      assignees,
    });

    if (event.isRecurring) {
      event.rrule = calculateRruleString(
        event.recurringType,
        event.startDateTime,
        event.untilDateTime,
        event.byWeekDay,
      );
    }

    await this.eventRepository.save(event);

    return event;
  }

  async findAssignees(assigneeIds: string[]) {
    const assignees = await this.commandBus.execute(
      new FindUsersByCommand({
        id: In(assigneeIds),
      }),
    );

    if (assignees.length < assigneeIds.length) {
      throw new BadRequestException('Some assignees are incorrect!');
    }

    return assignees;
  }

  async getAllEvents(
    user: UserEntity,
    getEventsDto: GetEventsDto,
  ): Promise<EventEntity[]> {
    const { fromDate, toDate } = getEventsDto;
    const oneTimeEvents = await this.getOneTimeEvents(user, fromDate, toDate);
    const timeZoneOffset = await this.getDeviceTimeZoneOffsetByUserId(user.id);
    const recurringEvents = await this.getRecurringEvents(
      user,
      fromDate,
      toDate,
    );

    return [...oneTimeEvents, ...recurringEvents].map((event) =>
      this.updateEventByTimeZoneOffset(event, timeZoneOffset),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  findByEventType(assigneeId: Uuid, eventType: EventType) {
    return this.eventRepository.find({
      where: { assignees: { id: assigneeId }, eventType },
      relations: {
        assignees: true,
      },
    });
  }

  async updateEvent(
    user: UserEntity,
    eventId: Uuid,
    updateEventDto: UpdateEventDto,
  ) {
    const eventEntity = await this.eventRepository.findOneOrFail({
      where: {
        id: eventId,
        familyId: user.familyId,
      },
      relations: {
        assignees: true,
      },
    });

    // todo: remove later
    // update assignees
    if (updateEventDto.assigneeId) {
      updateEventDto.assigneeIds = [updateEventDto.assigneeId];
    }

    if (updateEventDto.assigneeIds) {
      eventEntity.assignees = await this.findAssignees(
        updateEventDto.assigneeIds,
      );
    }

    this.eventRepository.merge(eventEntity, updateEventDto);

    if (eventEntity.isRecurring) {
      eventEntity.rrule = calculateRruleString(
        eventEntity.recurringType,
        eventEntity.startDateTime,
        eventEntity.untilDateTime,
        eventEntity.byWeekDay,
      );
    }

    return new EventDto(await this.eventRepository.save(eventEntity));
  }

  async deleteEvent(user: UserEntity, eventId: Uuid): Promise<void> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .where('event.id = :eventId', { eventId })
      .andWhere('family_id = :familyId', { familyId: user.familyId });

    const eventEntity = await queryBuilder.getOne();

    if (!eventEntity) {
      throw new NotFoundException();
    }

    await this.eventRepository.remove(eventEntity);
  }

  async deleteBirthdayByUsers(userIds: Uuid[]) {
    const events = await this.eventRepository.findBy({
      assignees: { id: In(userIds) },
      eventType: EventType.BIRTHDAY,
    });

    if (events.length > 0) {
      await this.eventRepository.remove(events);
    }
  }

  // notify users about upcoming events which start 15mins after reminder date
  async remindUpcommingEvents(reminderDate: Date): Promise<void> {
    const recurringEvents = await this.getUpcomingRecurringEvents(reminderDate);
    const oneTimeEvents = await this.getUpcomingOneTimeEvents(reminderDate);

    const messages = this.eventsToFirebaseMessages([
      ...recurringEvents,
      ...oneTimeEvents,
    ]);

    if (messages.length === 0) {
      return;
    }

    Logger.log(`remind upcoming ${messages.length} events`);
    await this.notificationService.sendFirebaseMessages(messages);
  }

  // get recruring events which has hour and minute of start datetime equal to current date
  private async getUpcomingOneTimeEvents(
    reminderDate: Date,
  ): Promise<EventEntity[]> {
    const fromReminderDate = addMinutes(reminderDate, MINUTES_ALERT_BEFORE);
    fromReminderDate.setSeconds(0, 0);

    return this.eventRepository.find({
      where: {
        isRecurring: false,
        startDateTime: fromReminderDate,
      },
      relations: ['family', 'family.members', 'family.members.devices'],
    });
  }

  // get recruring events which has hour and minute of start datetime equal to current date
  private async getUpcomingRecurringEvents(
    reminderDate: Date,
  ): Promise<EventEntity[]> {
    // calculate 15min after reminderDate
    const eventDate = addMinutes(reminderDate, MINUTES_ALERT_BEFORE);

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.family', 'family')
      .leftJoinAndSelect('family.members', 'user')
      .leftJoinAndSelect('user.devices', 'device')
      .where('event.is_recurring = true')
      .andWhere('start_date_time <= :eventDate', { eventDate })
      .andWhere(
        '(until_date_time IS NULL OR until_date_time >= CAST(NOW() AS Date))',
      )
      .andWhere('EXTRACT(hour FROM start_date_time) = :hour', {
        hour: eventDate.getHours(),
      })
      .andWhere('EXTRACT(minute FROM start_date_time) = :minute', {
        minute: eventDate.getMinutes(),
      });

    const events = await queryBuilder.getMany();

    // filter events which has rrule which includes (reminderDate plus 15mins)
    return events.filter((event) => {
      const rruleString = event.rrule || '';
      const rrule = new RRule(RRule.parseString(rruleString));
      const startEventDate = startOfDay(eventDate);
      const endEventDate = endOfDay(eventDate);

      const isStartEventDateInDateRange = isDateInRange(
        event.startDateTime,
        startEventDate,
        endEventDate,
      );

      return (
        rrule.between(startEventDate, endEventDate).length > 0 ||
        isStartEventDateInDateRange
      );
    });
  }

  private eventsToFirebaseMessages(
    events: EventEntity[],
  ): ISendFirebaseMessages[] {
    // eslint-disable-next-line unicorn/no-array-reduce
    return events.reduce((acc, currentEvent) => {
      // eslint-disable-next-line unicorn/no-array-for-each
      currentEvent.family.members.forEach((member) => {
        // eslint-disable-next-line unicorn/no-array-for-each
        member.devices?.forEach((device) => {
          if (device.token !== undefined) {
            acc.push({
              token: device.token,
              title: currentEvent.title,
              message: `Start: ${addHours(
                currentEvent.startDateTime,
                device.timezoneOffset,
              ).toLocaleTimeString()}`,
              customData: { type: 'event', id: currentEvent.id },
            });
          }
        });
      });

      return acc;
    }, [] as ISendFirebaseMessages[]);
  }

  // get one time events between from date and to date
  private async getOneTimeEvents(
    user: UserEntity,
    fromDate: Date,
    toDate: Date,
  ) {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.assignees', 'assignees');

    queryBuilder
      .where('event.family_id = :familyId', { familyId: user.familyId })
      .andWhere('event.is_recurring = :isRecurring', { isRecurring: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'event.start_date_time >= :fromDate AND event.start_date_time <= :toDate',
            {
              fromDate,
              toDate,
            },
          ).orWhere(
            'event.end_date_time >= :fromDate AND event.end_date_time <= :toDate',
            {
              fromDate,
              toDate,
            },
          );
        }),
      );

    return queryBuilder.getMany();
  }

  // get recurring events by getting all recurring events and filter them by start date time and rrule string
  private async getRecurringEvents(
    user: UserEntity,
    fromDate: Date,
    toDate: Date,
  ) {
    const recurringEvents = await this.eventRepository.find({
      where: {
        familyId: user.familyId,
        isRecurring: true,
      },
      relations: {
        assignees: true,
      },
    });

    return recurringEvents.filter((item) => {
      const rruleString = item.rrule || '';
      const rrule = new RRule(RRule.parseString(rruleString));
      const isStartDayInDateRange = isDateInRange(
        item.startDateTime,
        fromDate,
        toDate,
      );

      return (
        rrule.between(fromDate, toDate).length > 0 || isStartDayInDateRange
      );
    });
  }

  async suggestNames(user: UserEntity, textSearch?: string) {
    const textSearchQuery = _.join(
      _.map(_.split(textSearch, ' '), (str) => `%${str}%`),
      '',
    );
    const todos = await this.eventRepository
      .createQueryBuilder('event')
      .select('DISTINCT(title)', 'title')
      .where({
        familyId: user.familyId,
        title: ILike(textSearchQuery),
        eventType: EventType.MANUAL,
      })
      .orderBy({
        title: 'ASC',
      })
      .getRawMany();

    return todos.map((x) => x.title);
  }

  private updateEventByTimeZoneOffset(event: EventEntity, timeZoneOffset = 0) {
    if (!timeZoneOffset || event.eventType === EventType.MANUAL) {
      return event;
    }

    event.startDateTime = this.getTimeByTimeZoneOffset(
      event.startDateTime,
      timeZoneOffset,
    );
    event.endDateTime =
      event.endDateTime &&
      this.getTimeByTimeZoneOffset(event.endDateTime, timeZoneOffset);
    event.untilDateTime =
      event.untilDateTime &&
      this.getTimeByTimeZoneOffset(event.untilDateTime, timeZoneOffset);
    event.rrule = calculateRruleString(
      event.recurringType,
      event.startDateTime,
      event.untilDateTime,
      event.byWeekDay,
    );

    return event;
  }

  private getTimeByTimeZoneOffset(dateTime: Date, timeZoneOffset: number) {
    return new Date(
      dayjs(dateTime).subtract(timeZoneOffset, 'hour').toString(),
    );
  }

  private getDeviceTimeZoneOffsetByUserId(userId: Uuid) {
    return this.commandBus.execute<
      GetDeviceTimeZoneOffsetByUserIdCommand,
      number
    >(new GetDeviceTimeZoneOffsetByUserIdCommand(userId));
  }
}
