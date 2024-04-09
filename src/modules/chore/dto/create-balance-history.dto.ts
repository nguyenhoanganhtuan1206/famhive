import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringField } from '../../../decorators';

export class CreateBalanceHistoryRequestDto {
  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty({ example: 1.5 })
  @NumberField({ int: false })
  amount: number;
}
