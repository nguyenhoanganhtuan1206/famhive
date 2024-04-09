import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RecurringType } from '../../../constants/recurring-type';
import {
  BooleanField,
  DateField,
  DateFieldOptional,
  EnumFieldOptional,
  IsBehind,
  IsNullable,
  StringField,
  StringFieldOptional,
  Trim,
  UUIDFieldOptional,
} from '../../../decorators';
import { WeekDayType } from '../types/event.type';

export class CreateEventDto {
  @StringField({ maxLength: 128 })
  @Trim()
  title: string;

  @DateField()
  startDateTime: Date;

  @DateFieldOptional()
  @IsBehind('startDateTime', {
    message: 'must be behind startDateTime',
  })
  endDateTime?: Date;

  @StringFieldOptional({ maxLength: 6 })
  color?: string;

  @BooleanField()
  isAllday: boolean;

  @BooleanField()
  isRecurring: boolean;

  @EnumFieldOptional(() => RecurringType)
  @IsNullable()
  recurringType?: RecurringType;

  @DateFieldOptional()
  @IsNullable()
  @IsBehind('startDateTime', {
    message: 'must be behind startDateTime',
  })
  untilDateTime?: Date;

  @EnumFieldOptional(() => WeekDayType, { isArray: true, each: true })
  byWeekDay?: WeekDayType[];

  @ApiProperty({
    example: ['53f9fc2e-c72e-40fa-8619-6988a42cd4d9'],
    isArray: true,
  })
  @UUIDFieldOptional({ each: true })
  assigneeIds?: Uuid[];

  @ApiPropertyOptional({
    example: ['53f9fc2e-c72e-40fa-8619-6988a42cd4d9'],
    deprecated: true,
  })
  @UUIDFieldOptional()
  assigneeId?: Uuid;
}
