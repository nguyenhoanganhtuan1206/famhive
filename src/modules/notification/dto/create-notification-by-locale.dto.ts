import { ApiProperty } from '@nestjs/swagger';

import { LangCode } from '../../../constants';
import { EnumField, StringField } from '../../../decorators';

export class CreateNotificationByLocaleDto {
  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty()
  @StringField()
  content: string;

  @ApiProperty()
  @EnumField(() => LangCode)
  langCode: LangCode;
}
