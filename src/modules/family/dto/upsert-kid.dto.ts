import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  DateFieldOptional,
  EmailFieldOptional,
  StringField,
  ToLowerCase,
  TrimToNull,
  UUIDFieldOptional,
} from '../../../decorators';

export default class UpsertKidDto {
  @ApiProperty()
  @StringField()
  fullName: string;

  @ApiProperty()
  @StringField()
  color: string;

  @ApiPropertyOptional({ example: '2000-12-30' })
  @DateFieldOptional({ nullable: true })
  birthday?: Date;

  @ApiPropertyOptional({ example: 'example@email.com' })
  @TrimToNull()
  @EmailFieldOptional()
  @ToLowerCase()
  email?: string;

  @ApiPropertyOptional()
  @UUIDFieldOptional({ nullable: true })
  id?: Uuid;
}
