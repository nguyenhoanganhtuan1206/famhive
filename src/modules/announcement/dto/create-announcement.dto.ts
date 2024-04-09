import { ApiProperty } from '@nestjs/swagger';

import {
  BooleanField,
  ClassField,
  DateField,
  EnumField,
  IsFutureTime,
  StringField,
} from '../../../decorators';
import { AnnouncementForUserType } from '../constants/announcement-for-user-type';
import { ScreenName } from '../constants/screen-name';
import { CreateAnnouncementByLocaleDto } from './create-announcement-by-locale.dto';

export class CreateAnnouncementDto {
  @StringField()
  title: string;

  @ApiProperty({
    enum: AnnouncementForUserType,
    default: AnnouncementForUserType.ALL_USER,
  })
  @EnumField(() => AnnouncementForUserType)
  to: AnnouncementForUserType;

  @BooleanField()
  enabled: boolean;

  @DateField()
  @IsFutureTime()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;

  @ApiProperty({
    default: ScreenName.Home,
  })
  @StringField()
  redirectToScreen: ScreenName;

  @ApiProperty({ isArray: true })
  @StringField({ each: true })
  specificEmails: string[];

  @ClassField(() => CreateAnnouncementByLocaleDto, {
    each: true,
    isArray: true,
    minItems: 1,
  })
  announcementByLocales: CreateAnnouncementByLocaleDto[];
}
