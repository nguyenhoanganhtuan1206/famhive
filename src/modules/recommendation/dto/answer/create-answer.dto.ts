import { ApiProperty } from '@nestjs/swagger';

import { UUIDFieldOptional } from '../../../../decorators';

export class CreateAnswerDto {
  @ApiProperty({ isArray: true })
  @UUIDFieldOptional({ each: true })
  optionIds: Uuid[];
}
