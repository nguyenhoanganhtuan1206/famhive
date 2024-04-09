import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField } from '../../../decorators';
import type { MealEntity } from '../entities/meal.entity';

export default class MealDto extends AbstractDto {
  @StringField()
  name: string;

  constructor(mealEntity: MealEntity) {
    super(mealEntity);
    this.name = mealEntity.name;
  }
}
