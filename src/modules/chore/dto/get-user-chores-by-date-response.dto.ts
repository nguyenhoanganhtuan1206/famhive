import { ApiProperty } from '@nestjs/swagger';

import {
  BooleanField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators';

export class GetUserChoresByDateResponseDto {
  @ApiProperty()
  @UUIDField()
  id: string;

  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty()
  @NumberField()
  reward: number;

  @ApiProperty()
  @BooleanField()
  isDone: boolean;
}
