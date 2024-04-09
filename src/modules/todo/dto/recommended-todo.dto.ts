import { ApiProperty } from '@nestjs/swagger';

import { NumberFieldOptional, StringField } from '../../../decorators';

export class RecommendedTodoDto {
  @ApiProperty()
  @StringField()
  text: string;

  @ApiProperty()
  @NumberFieldOptional({ minimum: 0, maximum: 5 })
  award: number;
}
