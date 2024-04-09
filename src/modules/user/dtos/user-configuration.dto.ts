import { ApiPropertyOptional } from '@nestjs/swagger';

import { BooleanFieldOptional } from '../../../decorators';

export class UserConfigurationDto {
  @ApiPropertyOptional()
  @BooleanFieldOptional()
  isShowTodoDone?: boolean;

  @ApiPropertyOptional()
  @BooleanFieldOptional()
  isShowTaskDone?: boolean;
}
