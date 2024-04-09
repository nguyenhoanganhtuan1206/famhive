import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '../../../../decorators';

export class ChatContextSwaggerDto {
  @ApiProperty()
  @StringField()
  role: string;

  @ApiProperty()
  @StringField()
  content: string;
}
