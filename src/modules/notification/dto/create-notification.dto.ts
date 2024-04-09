import { ApiProperty } from '@nestjs/swagger';

import {
  ClassField,
  DateField,
  EnumField,
  IsFutureTime,
  StringField,
} from '../../../decorators';
import { NotificationForType } from '../types/notification-for.type';
import { NotificationType } from '../types/notification-type';
import { CreateNotificationByLocaleDto } from './create-notification-by-locale.dto';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationForType,
    default: NotificationForType.ALL_USER,
  })
  @EnumField(() => NotificationForType)
  to: NotificationForType;

  @ApiProperty({
    enum: NotificationType,
    default: NotificationType.EMAIL,
  })
  @EnumField(() => NotificationType)
  type: NotificationType;

  @ApiProperty({ isArray: true })
  @StringField({ each: true })
  specificEmails: string[];

  @ApiProperty()
  @DateField()
  @IsFutureTime()
  scheduledDateTime: Date;

  @ApiProperty()
  @ClassField(() => CreateNotificationByLocaleDto, {
    each: true,
    isArray: true,
    minItems: 1,
  })
  notificationByLocales: CreateNotificationByLocaleDto[];
}
