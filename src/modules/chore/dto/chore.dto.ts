import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import _ from 'lodash';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RecurringType } from '../../../constants/recurring-type';
import { WeekDayType } from '../../event/types/event.type';
import { UserRef } from '../../user/dtos/user-ref';
import type { ChoreEntity } from '../entities/chore.entity';

export class ChoreDto extends AbstractDto {
  @ApiProperty()
  icon: string;

  @ApiProperty()
  iconColor: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  assignees: UserRef[];

  @ApiProperty()
  dueDate?: Date;

  @ApiPropertyOptional()
  reward: number;

  @ApiProperty()
  isRecurring: boolean;

  @ApiProperty({ enum: RecurringType })
  recurringType?: RecurringType;

  @ApiProperty()
  untilDateTime?: Date;

  @ApiProperty({ enum: WeekDayType, isArray: true })
  byWeekDay?: WeekDayType[];

  @ApiProperty()
  rrule?: string;

  constructor(chore: ChoreEntity) {
    super(chore);
    this.icon = chore.icon;
    this.iconColor = chore.iconColor;
    this.title = chore.title;
    this.assignees = _.map(
      chore.assignees,
      (assignee) => new UserRef(assignee),
    );
    this.dueDate = chore.dueDate;
    this.isRecurring = chore.isRecurring;
    this.recurringType = chore.recurringType;
    this.untilDateTime = chore.untilDateTime;
    this.byWeekDay = chore.byWeekDay;
    this.rrule = chore.rrule;
  }

  static toChoreDto(choreEntity: ChoreEntity, rewardType: string) {
    const choreDto = new ChoreDto(choreEntity);

    return {
      ...choreDto,
      reward:
        rewardType === 'star'
          ? choreEntity.rewardStar
          : choreEntity.rewardMoney,
    };
  }
}
