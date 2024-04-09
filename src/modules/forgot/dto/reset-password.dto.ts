import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { ToLowerCase, ToUpperCase, Trim } from '../../../decorators';
import { SendCodeDto } from './send-code.dto';

export class ResetPasswordDto extends PartialType(SendCodeDto) {
  @IsString()
  @IsEmail()
  @ApiProperty()
  @Trim()
  @ToLowerCase()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @Trim()
  @ToUpperCase()
  readonly code: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
