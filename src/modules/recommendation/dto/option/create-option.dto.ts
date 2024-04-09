import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '../../../../decorators';

export class CreateOptionDto {
  @ApiProperty()
  @StringField()
  name: string;
}
