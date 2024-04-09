import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../../common/dto/abstract.dto';
import { LangCode } from '../../../../constants';
import { EnumField, StringField } from '../../../../decorators';
import type { DishEntity } from '../../entities/dish.entity';
import { IngredientDto } from '../ingredients/ingredient.dto';

export class DishDto extends AbstractDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @StringField()
  instructions: string;

  @ApiProperty()
  @EnumField(() => LangCode)
  language: LangCode;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty({
    isArray: true,
    type: IngredientDto,
  })
  ingredients: IngredientDto[];

  constructor(entity: DishEntity, options?: { excludeFields?: boolean }) {
    super(entity, options);
    this.name = entity.name;
    this.enabled = entity.enabled;
    this.instructions = entity.instructions;
    this.language = entity.language;
    this.ingredients = entity.ingredients.toDtos();
  }
}
