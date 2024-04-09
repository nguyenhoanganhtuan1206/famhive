import { ApiProperty } from '@nestjs/swagger';

import { DateField } from '../../../../decorators';

export class LastAnswerDateDto {
  @ApiProperty()
  @DateField()
  lastAnswerDate: Date;
}
