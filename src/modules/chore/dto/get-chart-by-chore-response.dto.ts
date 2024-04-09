import { ApiProperty } from '@nestjs/swagger';

import { EnumFieldOptional, StringField } from '../../../decorators';
import { ChoreStatus } from '../types/chore-status.enum';

export class GetChartByChoreMemberDto {
  @ApiProperty()
  @StringField()
  fullName: string;

  @EnumFieldOptional(() => ChoreStatus, { isArray: true, each: true })
  status: ChoreStatus[];
}

export class GetChartByChoreResponseDto {
  @ApiProperty()
  @StringField()
  icon: string;

  @ApiProperty()
  @StringField()
  iconColor: string;

  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty({ isArray: true })
  members: GetChartByChoreMemberDto[];
}
