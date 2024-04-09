import { ApiProperty } from '@nestjs/swagger';

import {
  BooleanFieldOptional,
  EnumField,
  StringField,
} from '../../../decorators';
import { TodoType } from '../types/todo.type';

export class CreateTodoCategoryDto {
  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty({
    enum: TodoType,
    default: TodoType.TASK,
  })
  @EnumField(() => TodoType)
  type: TodoType;

  @ApiProperty()
  @BooleanFieldOptional()
  byGpt: boolean;
}
