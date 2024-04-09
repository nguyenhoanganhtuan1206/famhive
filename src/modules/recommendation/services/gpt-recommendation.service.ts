import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserEntity } from 'modules/user/user.entity';
import type { ChatCompletionRequestMessage } from 'openai';
import { Repository } from 'typeorm';

import type { LangCode } from '../../../constants';
import {
  getDishDetailsGPTFunction,
  getDishesListGPTFunction,
  ISOLanguageEnum,
} from '../../../constants';
import { ChatGPTService } from '../../../shared/services/chat-gpt.service';
import { IngredientDto } from '../dto/ingredients/ingredient.dto';
import { AnswerEntity } from '../entities/answer.entity';
import { DishEntity } from '../entities/dish.entity';
import { IngredientEntity } from '../entities/ingredient.entity';
import type { IGPTDishDetails } from '../types/gpt-dish-details';
import type { IGPTDishesListRecommendations } from '../types/gpt-dish-list.type';
import { GPTChatRoleEnum } from '../types/gpt-role.enum';
import { RecommendationQuestionEnum } from '../types/questions.enum';

@Injectable()
export class GPTRecommendationService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly userAnswerRepository: Repository<AnswerEntity>,
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
    private readonly chatGPTService: ChatGPTService,
  ) {}

  async getRecommendation(
    user: UserEntity,
    languageCode: LangCode,
    amount?: number,
  ) {
    const chatContext: ChatCompletionRequestMessage[] = [];
    const language: ISOLanguageEnum = ISOLanguageEnum[languageCode];

    const searchLanguage =
      languageCode === 'en'
        ? language
        : `translated into ${language} excluding all English`;

    const answers = await this.userAnswerRepository.find({
      where: { userId: user.id },
      relations: {
        options: true,
        question: true,
      },
    });

    for (const answer of answers) {
      this.updateGPTDishPreferenceContext(answer, chatContext);
    }

    this.updateChatContext(
      chatContext,
      GPTChatRoleEnum.USER,
      `Give me a list of ${
        amount || 10
      } recipes that match my family preferences ${searchLanguage}.`,
    );

    return this.getRecommendationDishes(chatContext, language);
  }

  async loadMore(
    chatContext: ChatCompletionRequestMessage[],
    languageCode: LangCode,
    amount?: number,
  ) {
    const language: ISOLanguageEnum = ISOLanguageEnum[languageCode];
    const searchLanguage =
      languageCode === 'en'
        ? language
        : `translated into language excluding all English`;

    this.updateChatContext(
      chatContext,
      GPTChatRoleEnum.USER,
      `Give me a list of ${
        amount || 10
      } more different recipes that match my family preferences ${searchLanguage}.`,
    );

    return this.getRecommendationDishes(chatContext, language);
  }

  async getDetails(dishes: string[], languageCode: LangCode) {
    return Promise.all(
      dishes.map(async (dish) => {
        const dishDetails = await this.dishRepository.findOne({
          where: {
            name: dish.toLowerCase(),
            language: languageCode,
          },
          relations: { ingredients: true },
        });

        if (dishDetails) {
          return dishDetails;
        }

        return this.getDishDetails(dish, languageCode);
      }),
    );
  }

  async getDishDetails(dishName: string, languageCode: LangCode) {
    // eslint-disable-next-line max-len
    const content = `Give me a detailed description including ingredients and precise measurements for 1 person portion of this recipe: ${dishName} in this language: ${ISOLanguageEnum[languageCode]}`;

    const response = await this.chatGPTService.getChatCompletion(
      [{ role: 'user', content }],
      0.5,
      0.7,
      getDishDetailsGPTFunction,
    );

    const message = response.data.choices[0].message;

    if (
      !message ||
      !message.function_call ||
      !message.function_call.arguments
    ) {
      throw new Error('No response from OpenAI');
    }

    const dishDetails: IGPTDishDetails = JSON.parse(
      message.function_call.arguments,
    );

    const newDish = await this.dishRepository.save(
      this.dishRepository.create({
        name: dishDetails.dishName.toLowerCase(),
        instructions: dishDetails.instructions,
        enabled: true,
        language: languageCode,
        ingredients: [],
      }),
    );

    await Promise.all(
      dishDetails.ingredients.map(async (i) => {
        new IngredientDto(
          await this.ingredientRepository.save(
            this.ingredientRepository.create({
              name: i.name.toLowerCase(),
              unit: i.unit.toLowerCase(),
              quantity: i.quantity,
              dishId: newDish.id,
            }),
          ),
        );
      }),
    );

    return this.dishRepository.findOne({
      where: { id: newDish.id },
      relations: { ingredients: true },
    });
  }

  private async getRecommendationDishes(
    chatContext: ChatCompletionRequestMessage[],
    language: ISOLanguageEnum,
  ) {
    const response = await this.chatGPTService.getChatCompletion(
      chatContext,
      1,
      1,
      getDishesListGPTFunction(language),
    );

    const message = response.data.choices[0].message;

    if (message && message.function_call?.arguments) {
      const dishes: IGPTDishesListRecommendations = JSON.parse(
        message.function_call.arguments,
      );

      this.updateChatContext(
        chatContext,
        GPTChatRoleEnum.ASSISTANT,
        dishes.dishListString,
      );

      return {
        dishes: dishes.dishListArray,
        chatContext,
      };
    }
  }

  private updateGPTDishPreferenceContext(
    answer: AnswerEntity,
    chatContext: ChatCompletionRequestMessage[],
  ) {
    const answerOptions = answer.options
      .map((option) => option.name)
      .join(', ');

    let context = '';

    switch (answer.question.name) {
      case RecommendationQuestionEnum.ALLERGY: {
        context += `My family is allergic to ${answerOptions}.\n`;
        break;
      }

      case RecommendationQuestionEnum.DIET: {
        context += answerOptions.includes('None of the above')
          ? `My family does not follow any particular diet.\n`
          : `My family is following these diets: ${answerOptions}.\n`;

        break;
      }

      case RecommendationQuestionEnum.FOOD_TYPE: {
        context +=
          answer.options.length === 0
            ? `My family doesn't have any particular meat, fish, or vegetables preferences.\n`
            : `My family enjoys: ${answerOptions}.\n`;

        break;
      }

      case RecommendationQuestionEnum.FLAVORS: {
        context += `My family enjoys ${answerOptions} food.\n`;
        break;
      }

      case RecommendationQuestionEnum.COOKING_METHOD: {
        context += answerOptions.includes('Mixed')
          ? (context += `My family doesn't have any preferences on any cooking method.\n`)
          : (context += `My family prefers these ${answerOptions} food.\n`);
        break;
      }

      case RecommendationQuestionEnum.MEAL_TIME: {
        context += `A typical meal for my family usually lasts ${answerOptions}.\n`;
        break;
      }

      case RecommendationQuestionEnum.FASTFOOD: {
        context += `My family ${answerOptions} has fast food.\n`;
        break;
      }

      case RecommendationQuestionEnum.BEVERAGE: {
        context += answerOptions.includes('No particular preference')
          ? `My family doesn't have any particular beverage preferences along with our meal.\n`
          : `My family enjoys these beverages along with our meal: ${answerOptions}\n`;

        break;
      }

      case RecommendationQuestionEnum.CUISINE: {
        context +=
          answerOptions.includes('No particular preference') ||
          answer.options.length === 0
            ? `My family doesn't have any particular cuisine traditions preferences.\n`
            : `My family enjoys ${answerOptions} food.\n`;

        break;
      }

      case RecommendationQuestionEnum.SPICE_LEVEL: {
        context += `My family ${answerOptions} spicy food.\n`;

        break;
      }

      default: {
        throw new Error(
          `There are no existing questions for ${answer.question.name}`,
        );
      }
    }

    this.updateChatContext(chatContext, GPTChatRoleEnum.USER, context);

    return chatContext;
  }

  private updateChatContext(
    chatContext: ChatCompletionRequestMessage[],
    role: ChatCompletionRequestMessage['role'],
    message: string,
  ) {
    chatContext.push({
      role,
      content: message,
    });
  }
}
