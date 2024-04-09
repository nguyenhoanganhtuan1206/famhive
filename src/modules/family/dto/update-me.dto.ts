import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiPropertyOptional({ example: '2000-12-30' })
  @IsOptional()
  birthday?: Date;
}
