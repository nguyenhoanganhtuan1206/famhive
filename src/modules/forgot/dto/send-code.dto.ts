import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { ToLowerCase, Trim } from '../../../decorators';

export class SendCodeDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  @Trim()
  @ToLowerCase()
  readonly email: string;
}
