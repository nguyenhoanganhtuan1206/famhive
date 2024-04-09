import { ApiProperty } from '@nestjs/swagger';

import { BooleanField, EnumField, StringField } from '../../../../decorators';
import { QuestionType } from '../../entities/question-type';

export class CreateQuestionDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @BooleanField()
  enabled: boolean;

  @ApiProperty({ enum: QuestionType })
  @EnumField(() => QuestionType)
  type: QuestionType;

  @ApiProperty({ isArray: true })
  @StringField({ each: true })
  options: string[];
}
