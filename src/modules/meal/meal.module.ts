import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MealEntity } from './entities/meal.entity';
import { MealController } from './meal.controller';
import { SuperUserMealController } from './super-user-meal.controller';
import { SuperUserMealService } from './super-user-meal.service';
import { UserMealService } from './user.meal.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity])],
  controllers: [MealController, SuperUserMealController],
  providers: [UserMealService, SuperUserMealService],
})
export class MealModule {}
