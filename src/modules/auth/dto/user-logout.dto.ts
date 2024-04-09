import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLogoutDto {
  @ApiProperty()
  @IsString()
  deviceIdentifier: string;
}
