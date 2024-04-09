import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { LangCode } from '../../../constants';
import type { AnnouncementByLocaleEntity } from '../entities/announcement-by-locale.entity';

export class AnnouncementByLocaleDto extends AbstractDto {
  @ApiProperty({
    example: 'https://is3.com/image/thumb/...',
  })
  bannerUrl: string;

  @ApiProperty()
  textButton: string;

  @ApiProperty({
    enum: LangCode,
  })
  langCode: LangCode;

  constructor(announcementByLocale: AnnouncementByLocaleEntity) {
    super(announcementByLocale);
    this.bannerUrl = announcementByLocale.bannerUrl;
    this.textButton = announcementByLocale.textButton;
    this.langCode = announcementByLocale.langCode;
  }
}
