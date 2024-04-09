import { ApiProperty } from '@nestjs/swagger';

import { EnumFieldOptional, StringField } from '../../../decorators';
import { ChoreStatus } from '../types/chore-status.enum';

export class GetChartByProfileChoreDto {
  @ApiProperty()
  @StringField()
  icon: string;

  @ApiProperty()
  @StringField()
  iconColor: string;

  @ApiProperty()
  @StringField()
  title: string;

  @EnumFieldOptional(() => ChoreStatus, { isArray: true, each: true })
  status: ChoreStatus[];
}

export class GetChartByProfileResponseDto {
  @ApiProperty()
  @StringField()
  fullName: string;

  @ApiProperty({ isArray: true })
  chores: GetChartByProfileChoreDto[];
}
