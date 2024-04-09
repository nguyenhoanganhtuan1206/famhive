import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Transactional } from 'typeorm-transactional';

import { LangCode, RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { LanguageHeader } from '../../decorators/header.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateDishDto } from './dto/dishes/create-dish.dto';
import { DishDto } from './dto/dishes/dish.dto';
import { DishListDto } from './dto/dishes/dish-list.dto';
import { UpdateDishDto } from './dto/dishes/update-dish.dto';
import { GPTChatContextDto } from './dto/gpt/chat-context.dto';
import { CreateIngredientDto } from './dto/ingredients/create-ingredient.dto';
import { IngredientDto } from './dto/ingredients/ingredient.dto';
import { DishService } from './services/dish.service';
import { GPTRecommendationService } from './services/gpt-recommendation.service';
import { IngredientService } from './services/ingredient.service';

@Controller('dishes')
@ApiTags('dishes')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly ingredientService: IngredientService,
    private readonly gptRecommendationService: GPTRecommendationService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create a dish' })
  @ApiOkResponse({
    type: DishDto,
  })
  @Auth([RoleType.SUPERUSER])
  async create(@Body() createDishDto: CreateDishDto) {
    return new DishDto(await this.dishService.create(createDishDto));
  }

  @Get('all')
  @ApiOperation({ description: 'Get all dishes - For backoffice' })
  @ApiOkResponse({
    type: [DishDto],
  })
  @Auth([RoleType.SUPERUSER])
  async findAll() {
    const dishes = await this.dishService.findAll();

    return dishes.toDtos();
  }

  @Get()
  @ApiOperation({ description: 'Get all dishes - For mobile' })
  @ApiOkResponse({
    type: [DishDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  async findAllEnabled() {
    const dishes = await this.dishService.findAllEnabled();

    return dishes.toDtos();
  }

  @Get('recommendations')
  @ApiOperation({ description: 'Get recommendations' })
  @ApiOkResponse({
    type: [DishListDto],
  })
  @ApiHeader({
    name: 'Accept-Language',
    enum: LangCode,
    description: 'Config language',
  })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async recommend(
    @AuthUser() user: UserEntity,
    @LanguageHeader() languageCode: LangCode,
    @Query('amount') amount?: number,
  ) {
    return this.gptRecommendationService.getRecommendation(
      user,
      languageCode,
      amount,
    );
  }

  @Post('recommendations/loadmore')
  @ApiOperation({ description: 'Load more recommendations' })
  @ApiOkResponse({
    type: [DishListDto],
  })
  @ApiHeader({
    name: 'Accept-Language',
    enum: LangCode,
    description: 'Config language',
  })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async loadMore(
    @Body() body: GPTChatContextDto,
    @LanguageHeader() languageCode: LangCode,
    @Query('amount') amount?: number,
  ) {
    return this.gptRecommendationService.loadMore(
      body.chatContext,
      languageCode,
      amount,
    );
  }

  @Post('details')
  @ApiOperation({ description: 'Get dishes details' })
  @ApiOkResponse({
    type: [DishDto],
  })
  @ApiHeader({
    name: 'Accept-Language',
    enum: LangCode,
    description: 'Config language',
  })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async getDetails(
    @Body() body: DishListDto,
    @LanguageHeader() languageCode: LangCode,
  ) {
    return this.gptRecommendationService.getDetails(body.dishes, languageCode);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a specific dish by id' })
  @ApiOkResponse({
    type: DishDto,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  async findOne(@UUIDParam('id') id: Uuid) {
    return new DishDto(await this.dishService.findOneOrFail(id));
  }

  @Post(':id/ingredients')
  @ApiOperation({ description: 'Add an ingredient to the dish' })
  @ApiOkResponse({
    type: IngredientDto,
  })
  @Auth([RoleType.SUPERUSER])
  @Transactional()
  async addIngredient(
    @UUIDParam('id') id: Uuid,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    await this.dishService.findOneOrFail(id);

    return new IngredientDto(
      await this.ingredientService.create({
        ...createIngredientDto,
        dishId: id,
      }),
    );
  }

  @Put(':id')
  @ApiOperation({ description: 'Update a dish' })
  @Auth([RoleType.SUPERUSER])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    await this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a dish' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.dishService.remove(id);
  }
}
