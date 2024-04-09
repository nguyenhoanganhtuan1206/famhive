import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { TodoCategoryEntity } from '../entities/todo-category.entity';
import { TodoType } from '../types/todo.type';

export class TodoCategoryDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  type: TodoType;

  @ApiProperty()
  byGpt: boolean;

  constructor(category: TodoCategoryEntity) {
    super(category);
    this.title = category.title;
    this.type = category.type;
    this.byGpt = category.byGpt;
  }
}
