import { OmitType, PartialType } from '@nestjs/swagger';

import { ClassField } from '../../../decorators';
import { CreateNotificationDto } from './create-notification.dto';
import { UpdateNotificationByLocaleDto } from './update-notification-by-locale.dto';

export class UpdateNotificationDto extends OmitType(
  PartialType(CreateNotificationDto),
  ['notificationByLocales'],
) {
  @ClassField(() => UpdateNotificationByLocaleDto, {
    each: true,
    isArray: true,
    minItems: 1,
  })
  notificationByLocales: UpdateNotificationByLocaleDto[];
}
