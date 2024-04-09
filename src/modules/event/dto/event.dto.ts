import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import _ from 'lodash';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RecurringType } from '../../../constants/recurring-type';
import type { EventEntity } from '../entities/event.entity';
import { EventType, WeekDayType } from '../types/event.type';

export class EventDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  startDateTime: Date;

  @ApiPropertyOptional()
  endDateTime?: Date;

  @ApiProperty()
  isAllday: boolean;

  @ApiProperty()
  isRecurring: boolean;

  @ApiPropertyOptional({ enum: RecurringType })
  recurringType?: RecurringType;

  @ApiPropertyOptional()
  untilDateTime?: Date;

  @ApiPropertyOptional({ isArray: true, enum: WeekDayType })
  byWeekDay?: WeekDayType[];

  @ApiPropertyOptional()
  rrule?: string;

  @ApiPropertyOptional()
  assigneeIds?: Uuid[];

  @ApiPropertyOptional()
  assigneeId?: Uuid;

  @ApiPropertyOptional()
  familyId?: Uuid;

  @ApiPropertyOptional()
  eventType?: EventType;

  constructor(eventEntity: EventEntity) {
    super(eventEntity);
    this.title = eventEntity.title;
    this.startDateTime = eventEntity.startDateTime;
    this.endDateTime = eventEntity.endDateTime;
    this.isAllday = eventEntity.isAllday;
    this.isRecurring = eventEntity.isRecurring;
    this.recurringType = eventEntity.recurringType;
    this.untilDateTime = eventEntity.untilDateTime;
    this.byWeekDay = eventEntity.byWeekDay;
    this.rrule = eventEntity.rrule;
    this.assigneeIds = _.map(eventEntity.assignees, (assignee) => assignee.id);
    this.assigneeId = _.first(this.assigneeIds);
    this.familyId = eventEntity.familyId;
    this.eventType = eventEntity.eventType;
  }
}
