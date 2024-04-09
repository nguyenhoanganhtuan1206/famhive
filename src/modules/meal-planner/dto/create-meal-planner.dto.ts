import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsString } from 'class-validator';
import dayjs from 'dayjs';

import { DateField } from '../../../decorators';
import { MealPlannerType } from '../constants/meal-planner-type';

export default class CreateMealPlannerDto {
  @ApiProperty()
  @DateField()
  @Transform((date) => new Date(dayjs(date.value as Date).format('YYYY-MM-DD')))
  date: Date;

  @ApiProperty({ enum: MealPlannerType })
  @IsEnum(MealPlannerType)
  type: MealPlannerType;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  meals: string[];
}
