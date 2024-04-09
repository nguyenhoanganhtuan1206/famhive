import { NotFoundException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoCategoryEntity } from '../entities/todo-category.entity';

export class FindOneCategoryCommand implements ICommand {
  constructor(
    public readonly categoryId: Uuid,
    public readonly familyId: Uuid,
  ) {}
}

@CommandHandler(FindOneCategoryCommand)
export class FindOneCategoryHandler
  implements ICommandHandler<FindOneCategoryCommand, TodoCategoryEntity>
{
  constructor(
    @InjectRepository(TodoCategoryEntity)
    private todoCategoryRepository: Repository<TodoCategoryEntity>,
  ) {}

  async execute(command: FindOneCategoryCommand) {
    const category = await this.todoCategoryRepository.findOneBy({
      id: command.categoryId,
      familyId: command.familyId,
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${command.categoryId} was not found!`,
      );
    }

    return category;
  }
}
