import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { TodoCategoryDto } from '../dto/todo-category.dto';
import { TodoType } from '../types/todo.type';
import { TodoEntity } from './todo.entity';

@Entity('todo_categories')
@UseDto(TodoCategoryDto)
export class TodoCategoryEntity extends AbstractEntity<TodoCategoryDto> {
  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: TodoType,
    default: TodoType.TASK,
  })
  type: TodoType;

  @Column()
  familyId: Uuid;

  @Column({ default: false })
  byGpt: boolean;

  @OneToMany(() => TodoEntity, (todo) => todo.category, {
    cascade: true,
  })
  todos: TodoEntity[];
}
