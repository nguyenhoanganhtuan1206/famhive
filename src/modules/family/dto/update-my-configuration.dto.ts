import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateMyConfigurationDto {
  @ApiPropertyOptional()
  @IsBoolean()
  isShowTodoDone?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  isShowTaskDone?: boolean;
}
