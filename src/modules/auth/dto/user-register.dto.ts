import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ToLowerCase, Trim } from '../../../decorators';

export class UserRegisterDto {
  @ApiPropertyOptional()
  @IsString()
  readonly fullName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  @ToLowerCase()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
