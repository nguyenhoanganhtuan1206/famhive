import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { RecurringType } from '../../../constants/recurring-type';
import {
  BooleanFieldOptional,
  DateFieldOptional,
  EnumFieldOptional,
  IsBehind,
  IsFutureDate,
  IsNullable,
  NumberFieldOptional,
  StringField,
} from '../../../decorators';
import { WeekDayType } from '../../event/types/event.type';
import type { UserRef } from '../../user/dtos/user-ref';

export class CreateChoreDto {
  @ApiProperty()
  @StringField()
  icon: string;

  @ApiProperty()
  @StringField()
  iconColor: string;

  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty({
    example: [
      { id: '53f9fc2e-c72e-40fa-8619-6988a42cd4d9', fullName: 'Canh Phan' },
    ],
    isArray: true,
  })
  @IsArray()
  assignees: UserRef[];

  @ApiPropertyOptional({ example: new Date(), nullable: true })
  @IsNullable()
  @DateFieldOptional()
  @IsFutureDate()
  dueDate?: Date;

  @ApiPropertyOptional({ example: 1.5 })
  @NumberFieldOptional({ int: false, min: 0 })
  reward: number;

  @ApiProperty()
  @BooleanFieldOptional()
  isRecurring?: boolean;

  @EnumFieldOptional(() => RecurringType)
  @IsNullable()
  recurringType?: RecurringType;

  @DateFieldOptional()
  @IsNullable()
  @IsBehind('dueDate', {
    message: 'must be behind dueDate',
  })
  untilDateTime?: Date;

  @EnumFieldOptional(() => WeekDayType, { isArray: true, each: true })
  byWeekDay: WeekDayType[];
}
