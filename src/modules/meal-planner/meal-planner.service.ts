import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import type { MealPlannerType } from './constants/meal-planner-type';
import type CreateMealPlannerDto from './dto/create-meal-planner.dto';
import type { GetMealPlannersDto } from './dto/get-meal-planners.dto';
import type UpdateMealPlannerDto from './dto/update-meal-planner.dto';
import { MealPlannerEntity } from './entities/meal-planner.entity';

@Injectable()
export class MealPlannerService {
  constructor(
    @InjectRepository(MealPlannerEntity)
    private readonly mealPlannerRepository: Repository<MealPlannerEntity>,
  ) {}

  getMealPlanners(familyId: Uuid, getMealPlannersDto: GetMealPlannersDto) {
    const { fromDate, toDate } = getMealPlannersDto;

    return this.mealPlannerRepository.findBy({
      familyId,
      date: Between(fromDate, toDate),
    });
  }

  async create(familyId: Uuid, createMealPlannerDto: CreateMealPlannerDto) {
    await this.validateMealPlannerType(
      familyId,
      createMealPlannerDto.date,
      createMealPlannerDto.type,
    );
    const mealPlanner = this.mealPlannerRepository.create({
      ...createMealPlannerDto,
      familyId,
    });

    return this.mealPlannerRepository.save(mealPlanner);
  }

  async update(
    id: Uuid,
    familyId: Uuid,
    updateMealPlannerDto: UpdateMealPlannerDto,
  ) {
    const mealPlanner = await this.getMealPlanner(id, familyId);

    const { type } = updateMealPlannerDto;

    if (mealPlanner.type !== type) {
      await this.validateMealPlannerType(familyId, mealPlanner.date, type);
    }

    return this.mealPlannerRepository.save({
      ...mealPlanner,
      ...updateMealPlannerDto,
    });
  }

  async delete(id: Uuid, familyId: Uuid) {
    const mealPlanner = await this.getMealPlanner(id, familyId);
    await this.mealPlannerRepository.delete(mealPlanner.id);
  }

  async getMealPlanner(id: Uuid, familyId: Uuid) {
    return this.mealPlannerRepository.findOneByOrFail({
      id,
      familyId,
    });
  }

  private async validateMealPlannerType(
    familyId: Uuid,
    date: Date,
    type: MealPlannerType,
  ) {
    const mealPlanner = await this.mealPlannerRepository.findOneBy({
      date,
      type,
      familyId,
    });

    if (mealPlanner) {
      throw new BadRequestException(
        `The ${type} meal plan for this day already exists.`,
      );
    }
  }
}
