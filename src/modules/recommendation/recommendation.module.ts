import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswerController } from './answer.controller';
import { DishController } from './dish.controller';
import { AnswerEntity } from './entities/answer.entity';
import { DishEntity } from './entities/dish.entity';
import { IngredientEntity } from './entities/ingredient.entity';
import { OptionEntity } from './entities/option.entity';
import { QuestionEntity } from './entities/question.entity';
import { IngredientController } from './ingredient.controller';
import { OptionController } from './option.controller';
import { QuestionController } from './question.controller';
import { AnswerService } from './services/answer.service';
import { DishService } from './services/dish.service';
import { GPTRecommendationService } from './services/gpt-recommendation.service';
import { IngredientService } from './services/ingredient.service';
import { OptionService } from './services/option.service';
import { QuestionService } from './services/question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DishEntity,
      IngredientEntity,
      QuestionEntity,
      OptionEntity,
      AnswerEntity,
    ]),
  ],
  controllers: [
    DishController,
    IngredientController,
    QuestionController,
    OptionController,
    AnswerController,
  ],
  providers: [
    GPTRecommendationService,
    DishService,
    IngredientService,
    QuestionService,
    OptionService,
    AnswerService,
  ],
})
export class RecommendationModule {}
