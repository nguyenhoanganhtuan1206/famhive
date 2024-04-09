import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { StringField } from '../../../../decorators';
import type { OptionEntity } from '../../entities/option.entity';

export class OptionDto extends AbstractDto {
  @ApiProperty()
  @StringField()
  name: string;

  constructor(entity: OptionEntity, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.name = entity.name;
  }
}
