import { ApiProperty } from '@nestjs/swagger';

import { DateField, UUIDField } from '../../../decorators';

export class CheckDoneDto {
  @ApiProperty({
    example: '53f9fc2e-c72e-40fa-8619-6988a42cd4d9',
  })
  @UUIDField()
  userId: Uuid;

  @ApiProperty()
  @DateField()
  date: Date;
}
