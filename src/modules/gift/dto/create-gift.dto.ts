import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringField } from '../../../decorators';

export class CreateGiftDto {
  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty({ example: 4 })
  @NumberField({ int: true, min: 0 })
  star: number;
}
