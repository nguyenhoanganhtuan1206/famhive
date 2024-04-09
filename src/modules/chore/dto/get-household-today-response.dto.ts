import { ApiProperty } from '@nestjs/swagger';

import { NumberField, StringField, UUIDField } from '../../../decorators';

export class GetHouseholdTodayResponseDto {
  @ApiProperty()
  @UUIDField()
  id: string;

  @ApiProperty()
  @StringField()
  fullName: string;

  @ApiProperty()
  @StringField()
  color: string;

  @ApiProperty()
  @NumberField()
  dueToday: number;
}
