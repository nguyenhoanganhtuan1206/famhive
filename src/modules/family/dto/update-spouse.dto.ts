import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import {
  DateFieldOptional,
  EmailField,
  StringField,
  ToLowerCase,
  Trim,
} from '../../../decorators';

export class UpdateSpouseDto {
  @ApiProperty()
  @StringField()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @EmailField()
  @IsNotEmpty()
  @Trim()
  @ToLowerCase()
  email: string;

  @ApiProperty()
  @StringField()
  @IsNotEmpty()
  color: string;

  @ApiPropertyOptional({ example: '2000-12-30' })
  @DateFieldOptional({ nullable: true })
  birthday?: Date;
}
