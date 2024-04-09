// Reference
// https://vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/
// https://www.nylas.com/blog/calendar-events-rrules/
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RecurringType } from '../../../constants/recurring-type';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import { UserEntity } from '../../user/user.entity';
import { EventDto } from '../dto/event.dto';
import { EventType, WeekDayType } from '../types/event.type';

export interface IEventEntity extends IAbstractEntity<EventDto> {
  title: string;

  color?: string;

  startDateTime: Date;

  endDateTime?: Date;

  isAllday: boolean;

  isRecurring: boolean;

  untilDateTime?: Date;

  byWeekDay?: WeekDayType[];

  rrule?: string;

  parentId?: Uuid;

  familyId?: Uuid;
}

@Entity({ name: 'events' })
@UseDto(EventDto)
export class EventEntity
  extends AbstractEntity<EventDto>
  implements IEventEntity
{
  @Column()
  title: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDateTime?: Date | undefined;

  @Column()
  isAllday: boolean;

  @Column()
  isRecurring: boolean;

  @Column({ type: 'enum', enum: RecurringType, nullable: true })
  recurringType?: RecurringType;

  @Column({ type: 'timestamp', nullable: true })
  untilDateTime?: Date | undefined;

  @Column({
    type: 'enum',
    enum: WeekDayType,
    array: true,
    nullable: true,
  })
  byWeekDay?: WeekDayType[];

  @Column({ nullable: true })
  rrule?: string;

  @Column({ type: 'uuid', nullable: true })
  parentId?: Uuid;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  assignees: UserEntity[];

  @Column()
  familyId: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.events, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_event_family' })
  family: FamilyEntity;

  @Column({ default: EventType.MANUAL, enum: EventType, type: 'enum' })
  eventType: EventType;
}
