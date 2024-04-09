import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import type { UserEntity } from '../user/user.entity';
import { CategoryRecommendationDto } from './dto/category-recommendation.dto';
import { CategoryRecommendationV2Dto } from './dto/category-recommendation-v2.dto';
import type { CreateMultipleCategoriesTasksDto } from './dto/create-multiple-categories-tasks.dto';
import type { RecommendedCategoryDto } from './dto/recommended-category.dto';
import { TodoCategoryDto } from './dto/todo-category.dto';
import { TodoEntity } from './entities/todo.entity';
import { TodoCategoryEntity } from './entities/todo-category.entity';
import { TodoType } from './types/todo.type';

@Injectable()
export class TodoCategoriesService {
  constructor(
    @InjectRepository(TodoCategoryEntity)
    private readonly todoCategoriesRepository: Repository<TodoCategoryEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async findAll(user: UserEntity) {
    return this.todoCategoriesRepository.find({
      where: {
        familyId: user.familyId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findByType(user: UserEntity, type: TodoType) {
    return this.todoCategoriesRepository.find({
      where: {
        familyId: user.familyId,
        type,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  getCategoriesRecommendation() {
    const data = this.i18nService.t('5-mins', {
      lang: I18nContext.current()?.lang,
    });

    return _.map(_.values(data), (item) => new CategoryRecommendationDto(item));
  }

  getCategoriesRecommendationV2() {
    const data = this.i18nService.t('5-mins-v2', {
      lang: I18nContext.current()?.lang,
    });

    return _.map(
      _.values(data),
      (item) => new CategoryRecommendationV2Dto(item),
    );
  }

  async create(
    user: UserEntity,
    createTodoCategoryDto: Partial<TodoCategoryEntity>,
  ) {
    const newCategory = await this.todoCategoriesRepository.save(
      this.todoCategoriesRepository.create({
        ...createTodoCategoryDto,
        familyId: user.familyId,
      }),
    );

    return newCategory.toDto();
  }

  async createMany(
    user: UserEntity,
    manyCategories: CreateMultipleCategoriesTasksDto[],
  ) {
    const categories = await this.todoCategoriesRepository.save(
      this.todoCategoriesRepository.create(
        manyCategories.map((category) => ({
          title: category.categoryName,
          type: TodoType.TASK,
          byGpt: false,
          familyId: user.familyId,
          todos: category.tasks.map((task) =>
            this.todoRepository.create({
              type: TodoType.TASK,
              text: task,
              isDone: false,
              assignees: [user],
              familyId: user.familyId,
              award: 0,
            }),
          ),
        })),
      ),
    );

    return categories.toDtos();
  }

  async createManyV2(
    user: UserEntity,
    manyCategories: RecommendedCategoryDto[],
  ) {
    const categories = await this.todoCategoriesRepository.save(
      this.todoCategoriesRepository.create(
        manyCategories.map((category) => ({
          title: category.categoryName,
          type: TodoType.TASK,
          byGpt: false,
          familyId: user.familyId,
          todos: category.tasks.map((task) =>
            this.todoRepository.create({
              type: TodoType.TASK,
              text: task.text,
              isDone: false,
              assignees: [user],
              familyId: user.familyId,
              award: task.award,
            }),
          ),
        })),
      ),
    );

    return categories.toDtos();
  }

  async update(id: Uuid, updateTodoCategoryDto: Partial<TodoCategoryEntity>) {
    // check category
    const category = await this.findOneById(id);

    const categoryUpdated = await this.todoCategoriesRepository.save({
      ...category,
      ...updateTodoCategoryDto,
    });

    return new TodoCategoryDto(categoryUpdated);
  }

  async remove(id: Uuid) {
    const category = await this.findOneById(id);

    return this.todoCategoriesRepository.delete(category.id);
  }

  private async findOneById(id: Uuid) {
    return this.todoCategoriesRepository.findOneByOrFail({
      id,
    });
  }
}
