import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { IsNull, Repository } from 'typeorm';

import type CreateMealDto from './dto/create-meal.dto';
import type UpdateMealDto from './dto/update-meal.dto';
import { MealEntity } from './entities/meal.entity';
import { MealService } from './meal.service';

@Injectable()
export class SuperUserMealService extends MealService {
  constructor(
    @InjectRepository(MealEntity)
    mealRepository: Repository<MealEntity>,
    i18nService: I18nService,
  ) {
    super(mealRepository, i18nService);
  }

  async getMany(): Promise<string[]> {
    return this.getMealsAndDefault({
      familyId: IsNull(),
    });
  }

  async getOne(id: Uuid) {
    return this.getMeal({
      id,
      familyId: IsNull(),
    });
  }

  async create(createMealDto: CreateMealDto) {
    return this.createMeal({
      ...createMealDto,
    });
  }

  async update(id: Uuid, updateMealDto: UpdateMealDto) {
    return this.updateMeal(
      {
        id,
        familyId: IsNull(),
      },
      updateMealDto,
    );
  }

  async delete(id: Uuid) {
    await this.deleteMeal({
      id,
      familyId: IsNull(),
    });
  }
}
