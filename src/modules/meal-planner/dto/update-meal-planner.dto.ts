import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { MealPlannerType } from '../constants/meal-planner-type';

export default class UpdateMealPlannerDto {
  @ApiProperty({ enum: MealPlannerType })
  @IsEnum(MealPlannerType)
  type: MealPlannerType;

  @ApiProperty()
  @IsString({ each: true })
  meals: string[];
}
