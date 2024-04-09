import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { ApiEnumProperty, StringField } from '../../../../decorators';
import type { QuestionEntity } from '../../entities/question.entity';
import { QuestionType } from '../../entities/question-type';
import type { OptionDto } from '../option/option.dto';

export class QuestionDto extends AbstractDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  options: OptionDto[];

  @ApiEnumProperty(() => QuestionType)
  type: QuestionType;

  constructor(entity: QuestionEntity) {
    super(entity);
    this.name = entity.name;
    this.enabled = entity.enabled;
    this.type = entity.type;
    this.options = entity.options.toDtos();
  }
}
