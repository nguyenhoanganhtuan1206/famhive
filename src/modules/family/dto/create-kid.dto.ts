import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  DateFieldOptional,
  EmailFieldOptional,
  NumberField,
  StringField,
  ToLowerCase,
  TrimToNull,
} from '../../../decorators';

export default class CreateKidDto {
  @ApiProperty()
  @StringField()
  fullName: string;

  @ApiPropertyOptional({ example: '2000-12-30' })
  @DateFieldOptional({ nullable: true })
  birthday?: Date;

  @ApiPropertyOptional({ example: 'example@email.com' })
  @EmailFieldOptional()
  @TrimToNull()
  @ToLowerCase()
  email?: string;

  @ApiProperty()
  @NumberField()
  order: number;

  @ApiProperty()
  @StringField()
  color: string;
}
