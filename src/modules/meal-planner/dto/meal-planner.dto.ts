import { IsEnum, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DateField } from '../../../decorators';
import { MealPlannerType } from '../constants/meal-planner-type';
import type { MealPlannerEntity } from '../entities/meal-planner.entity';

export default class MealPlannerDto extends AbstractDto {
  @DateField()
  date: Date;

  @IsEnum(MealPlannerType)
  type: MealPlannerType;

  @IsString({ each: true })
  meals: string[];

  constructor(mealPlannerEntity: MealPlannerEntity) {
    super(mealPlannerEntity);
    this.date = mealPlannerEntity.date;
    this.type = mealPlannerEntity.type;
    this.meals = mealPlannerEntity.meals;
  }
}
