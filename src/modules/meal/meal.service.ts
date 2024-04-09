import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { MealEntity } from './entities/meal.entity';

type MealFilter =
  | FindOptionsWhere<MealEntity>
  | Array<FindOptionsWhere<MealEntity>>;

export class MealService {
  constructor(
    @InjectRepository(MealEntity)
    protected readonly mealRepository: Repository<MealEntity>,
    protected readonly i18nService: I18nService,
  ) {}

  protected async getMealsAndDefault(where: MealFilter): Promise<string[]> {
    const mealsFromDb = await this.mealRepository.findBy(where);

    const meals = [
      ...mealsFromDb.map((mealEntity) => mealEntity.name),
      ...this.loadMealListDefault(),
    ];

    return [...new Set(meals)];
  }

  protected async getMeal(where: MealFilter) {
    return this.mealRepository.findOneByOrFail(where);
  }

  protected async createMeal(mealEntity: Partial<MealEntity>) {
    return this.mealRepository.save(this.mealRepository.create(mealEntity));
  }

  protected async updateMeal(
    where: MealFilter,
    updateMeal: Partial<MealEntity>,
  ) {
    const meal = await this.mealRepository.findOneByOrFail(where);

    return this.mealRepository.save({
      ...meal,
      ...updateMeal,
    });
  }

  protected async deleteMeal(where: MealFilter) {
    const meal = await this.mealRepository.findOneByOrFail(where);
    await this.mealRepository.delete(meal.id);
  }

  private loadMealListDefault(): string[] {
    return _.toArray(
      this.i18nService.t('meal-list-default', {
        lang: I18nContext.current()?.lang,
      }),
    );
  }
}
