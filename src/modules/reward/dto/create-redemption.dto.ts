import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringField, UUIDField } from '../../../decorators';

export class CreateRedemptionDto {
  @ApiProperty({
    example: '53f9fc2e-c72e-40fa-8619-6988a42cd4d9',
    description: 'Who will be redeem/deduct',
  })
  @UUIDField()
  userId: Uuid;

  @ApiProperty()
  @NumberField({ int: true, min: 0 })
  amount: number;

  @ApiProperty()
  @StringField()
  description: string;
}
