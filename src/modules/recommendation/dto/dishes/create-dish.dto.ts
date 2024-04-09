import { ApiProperty } from '@nestjs/swagger';

import { BooleanField, StringField } from '../../../../decorators';

export class CreateDishDto {
  @ApiProperty()
  @StringField()
  name: string;

  @ApiProperty()
  @StringField()
  instructions: string;

  @ApiProperty()
  @BooleanField()
  enabled: boolean;
}
