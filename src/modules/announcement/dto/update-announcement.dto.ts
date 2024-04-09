import { OmitType, PartialType } from '@nestjs/swagger';

import { ClassField } from '../../../decorators';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { UpdateAnnouncementByLocaleDto } from './update-announcement-by-locale.dto';

export class UpdateAnnouncementDto extends OmitType(
  PartialType(CreateAnnouncementDto),
  ['announcementByLocales'],
) {
  @ClassField(() => UpdateAnnouncementByLocaleDto, {
    each: true,
    isArray: true,
    minItems: 1,
  })
  announcementByLocales: UpdateAnnouncementByLocaleDto[];
}
