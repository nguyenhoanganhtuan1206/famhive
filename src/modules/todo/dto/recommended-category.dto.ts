import { ApiProperty } from '@nestjs/swagger';

import { ClassField, StringField } from '../../../decorators';
import { RecommendedTodoDto } from './recommended-todo.dto';

export class RecommendedCategoryDto {
  @ApiProperty()
  @StringField()
  categoryName: string;

  @ApiProperty({
    isArray: true,
    type: RecommendedTodoDto,
  })
  @ClassField(() => RecommendedTodoDto, { isArray: true })
  tasks: RecommendedTodoDto[];
}
