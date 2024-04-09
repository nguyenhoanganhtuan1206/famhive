import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '../../../../decorators';

export class CreateIngredientDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @StringField()
  unit: string;

  @ApiProperty()
  @StringField()
  quantity: string;
}
