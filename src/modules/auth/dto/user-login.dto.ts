import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { ToLowerCase, Trim } from '../../../decorators';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  @Trim()
  @ToLowerCase()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
