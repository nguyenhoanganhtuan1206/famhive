import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MealPlannerEntity } from './entities/meal-planner.entity';
import { MealPlannerController } from './meal-planner.controller';
import { MealPlannerService } from './meal-planner.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlannerEntity])],
  controllers: [MealPlannerController],
  providers: [MealPlannerService],
})
export class MealPlannerModule {}
