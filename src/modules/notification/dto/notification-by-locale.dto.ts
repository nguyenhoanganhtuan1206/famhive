import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { LangCode } from '../../../constants';
import type { NotificationByLocaleEntity } from '../entities/notification-by-locale.entity';

export class NotificationByLocaleDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    enum: LangCode,
  })
  langCode: LangCode;

  constructor(announcementByLocale: NotificationByLocaleEntity) {
    super(announcementByLocale);
    this.title = announcementByLocale.title;
    this.content = announcementByLocale.content;
    this.langCode = announcementByLocale.langCode;
  }
}
