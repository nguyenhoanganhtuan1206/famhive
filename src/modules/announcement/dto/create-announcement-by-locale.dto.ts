import { ApiProperty } from '@nestjs/swagger';

import { LangCode } from '../../../constants';
import { EnumField, StringField } from '../../../decorators';

export class CreateAnnouncementByLocaleDto {
  @ApiProperty()
  @StringField()
  bannerUrl: string;

  @ApiProperty()
  @StringField()
  textButton: string;

  @ApiProperty()
  @EnumField(() => LangCode)
  langCode: LangCode;
}
