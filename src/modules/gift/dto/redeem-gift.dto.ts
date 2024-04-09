import { ApiProperty } from '@nestjs/swagger';

import { UUIDArrayField, UUIDField } from '../../../decorators';

export class RedeemGiftDto {
  @ApiProperty({
    example: '5f05fc5e-1254-4c1f-86ba-01b4dfaa2d09',
  })
  @UUIDField()
  giftId: Uuid;

  @ApiProperty({
    example: ['53f9fc2e-c72e-40fa-8619-6988a42cd4d9'],
    isArray: true,
  })
  @UUIDArrayField({ minLength: 1 })
  assigneeIds: Uuid[];
}
