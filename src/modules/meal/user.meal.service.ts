import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { IsNull, Repository } from 'typeorm';

import type CreateMealDto from './dto/create-meal.dto';
import type UpdateMealDto from './dto/update-meal.dto';
import { MealEntity } from './entities/meal.entity';
import { MealService } from './meal.service';

@Injectable()
export class UserMealService extends MealService {
  constructor(
    @InjectRepository(MealEntity)
    mealRepository: Repository<MealEntity>,
    i18nService: I18nService,
  ) {
    super(mealRepository, i18nService);
  }

  async getOne(id: Uuid, familyId: Uuid) {
    return this.getMeal([
      {
        id,
        familyId: IsNull(),
      },
      {
        id,
        familyId,
      },
    ]);
  }

  async getMany(familyId: Uuid): Promise<string[]> {
    return this.getMealsAndDefault([
      {
        familyId: IsNull(),
      },
      {
        familyId,
      },
    ]);
  }

  async create(familyId: Uuid, createMealDto: CreateMealDto) {
    return this.createMeal({
      ...createMealDto,
      familyId,
    });
  }

  async update(id: Uuid, familyId: Uuid, updateMealDto: UpdateMealDto) {
    return this.updateMeal({ id, familyId }, updateMealDto);
  }

  async delete(id: Uuid, familyId: Uuid) {
    await this.deleteMeal({ id, familyId });
  }
}
