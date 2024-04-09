import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '../../../decorators';

export class ConfigDto {
  @ApiProperty()
  @StringField()
  rewardType: string;
}
