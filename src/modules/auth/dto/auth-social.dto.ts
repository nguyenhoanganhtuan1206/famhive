import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Trim } from '../../../decorators';

export class AuthSocialDto {
  @ApiProperty({ example: 'token' })
  @IsNotEmpty()
  idToken: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly fullName: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  loginOnWeb: boolean;
}
