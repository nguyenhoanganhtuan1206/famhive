import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import {
  ApiTranslateOptions,
  Auth,
  AuthUser,
  UUIDParam,
} from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { ParamTodoType } from './decorators';
import { CategoryRecommendationDto } from './dto/category-recommendation.dto';
import { CategoryRecommendationV2Dto } from './dto/category-recommendation-v2.dto';
import { CreateMultipleCategoriesTasksDto } from './dto/create-multiple-categories-tasks.dto';
import { CreateTodoCategoryDto } from './dto/create-todo-category.dto';
import { RecommendedCategoryDto } from './dto/recommended-category.dto';
import { TodoCategoryDto } from './dto/todo-category.dto';
import { UpdateTodoCategoryDto } from './dto/update-todo-category.dto';
import { TodoCategoriesService } from './todo-categories.service';
import { TodoType } from './types/todo.type';

@Controller('todo-categories')
@ApiTags('Todo categories')
export class TodoCategoriesController {
  constructor(private readonly todoCategoriesService: TodoCategoriesService) {}

  @Get()
  @ApiOperation({ description: 'Get all todo categories' })
  @ApiOkResponse({
    type: [TodoCategoryDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER, RoleType.KID])
  async findAll(@AuthUser() user: UserEntity) {
    const categories = await this.todoCategoriesService.findAll(user);

    return categories.toDtos();
  }

  /**
   *
   * @deprecated
   * TODO: To be removed after confirmation of the old app version is longer in used
   */
  @Get('5-mins')
  @ApiOperation({ description: 'Get categories and tasks recommendation' })
  @ApiTranslateOptions()
  @ApiOkResponse({
    type: [CategoryRecommendationDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER, RoleType.KID])
  getCategoriesRecommendation() {
    return this.todoCategoriesService.getCategoriesRecommendation();
  }

  // TODO: Remove the old one
  @Get('v2/5-mins')
  @ApiOperation({
    description: 'Get categories and tasks recommendation - version 2',
  })
  @ApiTranslateOptions()
  @ApiOkResponse({
    type: [CategoryRecommendationV2Dto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER, RoleType.KID])
  getCategoriesRecommendationV2() {
    return this.todoCategoriesService.getCategoriesRecommendationV2();
  }

  @Get(':type')
  @ApiOperation({ description: 'Get todo categories by type' })
  @ApiParam({
    name: 'type',
    enum: TodoType,
  })
  @ApiOkResponse({
    type: [TodoCategoryDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER, RoleType.KID])
  async findByType(
    @AuthUser() user: UserEntity,
    @ParamTodoType() type: TodoType,
  ) {
    const categories = await this.todoCategoriesService.findByType(user, type);

    return categories.toDtos();
  }

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create a todo category' })
  @ApiOkResponse({
    type: TodoCategoryDto,
  })
  create(
    @AuthUser() user: UserEntity,
    @Body() createTodoCategoryDto: CreateTodoCategoryDto,
  ) {
    return this.todoCategoriesService.create(user, createTodoCategoryDto);
  }

  @Post('create-many')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create multiple categories and tasks' })
  @ApiBody({ type: [CreateMultipleCategoriesTasksDto] })
  @ApiOkResponse({
    type: [TodoCategoryDto],
  })
  createMany(
    @AuthUser() user: UserEntity,
    @Body() manyCategories: CreateMultipleCategoriesTasksDto[],
  ) {
    return this.todoCategoriesService.createMany(user, manyCategories);
  }

  @Post('v2/create-many')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create multiple categories and tasks v2' })
  @ApiBody({ type: [RecommendedCategoryDto] })
  @ApiOkResponse({
    type: [TodoCategoryDto],
  })
  createManyV2(
    @AuthUser() user: UserEntity,
    @Body() manyCategories: RecommendedCategoryDto[],
  ) {
    return this.todoCategoriesService.createManyV2(user, manyCategories);
  }

  @Patch(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  @ApiOperation({ description: 'Update a todo category' })
  @ApiOkResponse({
    type: TodoCategoryDto,
  })
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateTodoCategoryDto: UpdateTodoCategoryDto,
  ) {
    return this.todoCategoriesService.update(id, updateTodoCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a todo category' })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  remove(@UUIDParam('id') id: Uuid) {
    return this.todoCategoriesService.remove(id);
  }
}
