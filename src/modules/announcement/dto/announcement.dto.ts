import { ApiProperty } from '@nestjs/swagger';
import _ from 'lodash';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AnnouncementForUserType } from '../constants/announcement-for-user-type';
import { ScreenName } from '../constants/screen-name';
import type { AnnouncementEntity } from '../entities/announcement.entity';
import { AnnouncementByLocaleDto } from './announcement-by-locale.dto';

export class AnnouncementDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty({
    enum: AnnouncementForUserType,
    default: AnnouncementForUserType.ALL_USER,
  })
  to: AnnouncementForUserType;

  @ApiProperty({ isArray: true })
  specificEmails: string[];

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  startDateTime: Date;

  @ApiProperty()
  endDateTime: Date;

  @ApiProperty({
    default: ScreenName.Home,
    enum: ScreenName,
  })
  redirectToScreen: ScreenName;

  @ApiProperty({
    type: [AnnouncementByLocaleDto],
  })
  announcementByLocales: AnnouncementByLocaleDto[];

  constructor(announcement: AnnouncementEntity) {
    super(announcement);
    this.title = announcement.title;
    this.to = announcement.to;
    this.specificEmails = announcement.specificEmails;
    this.enabled = announcement.enabled;
    this.startDateTime = announcement.startDateTime;
    this.endDateTime = announcement.endDateTime;
    this.redirectToScreen = announcement.redirectToScreen;

    if (_.size(announcement.announcementByLocales)) {
      this.announcementByLocales = announcement.announcementByLocales.toDtos();
    }
  }
}
