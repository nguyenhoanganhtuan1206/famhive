import { ApiProperty } from '@nestjs/swagger';

import {
  EnumField,
  IsNullable,
  NumberField,
  StringField,
  UUIDField,
  UUIDFieldOptional,
} from '../../../decorators';
import { AwardHistoryType } from './../../../constants/award-history-type';

export class CreateAwardHistoryDto {
  @ApiProperty()
  @UUIDField()
  userId: Uuid;

  @ApiProperty()
  @NumberField({ int: true, min: 0 })
  amount: number;

  @ApiProperty()
  @StringField()
  description: string;

  @ApiProperty({
    enum: AwardHistoryType,
    default: AwardHistoryType.REDEEMED,
  })
  @EnumField(() => AwardHistoryType)
  type: AwardHistoryType;

  @ApiProperty()
  @UUIDFieldOptional()
  @IsNullable()
  todoId?: Uuid;
}
