import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { StringField } from '../../../../decorators';
import type { IngredientEntity } from '../../entities/ingredient.entity';

export class IngredientDto extends AbstractDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @StringField()
  unit: string;

  @ApiProperty()
  @StringField()
  quantity: string;

  constructor(entity: IngredientEntity, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.name = entity.name;
    this.unit = entity.unit;
    this.quantity = entity.quantity;
  }
}
