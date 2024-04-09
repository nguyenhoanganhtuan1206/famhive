import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { NotificationEntity } from '../entities/notification.entity';
import { NotificationForType } from '../types/notification-for.type';
import { NotificationStatusType } from '../types/notification-status.type';
import { NotificationByLocaleDto } from './notification-by-locale.dto';

export class NotificationDto extends AbstractDto {
  @ApiProperty({
    enum: NotificationForType,
    default: NotificationForType.ALL_USER,
  })
  to: NotificationForType;

  @ApiProperty({ isArray: true })
  specificEmails: string[];

  @ApiProperty()
  scheduledDateTime: Date;

  @ApiProperty({
    enum: NotificationStatusType,
    default: NotificationStatusType.PENDING,
  })
  status?: NotificationStatusType;

  @ApiProperty({
    type: [NotificationByLocaleDto],
  })
  notificationByLocales: NotificationByLocaleDto[];

  constructor(notification: NotificationEntity) {
    super(notification);
    this.to = notification.to;
    this.scheduledDateTime = notification.scheduledDateTime;
    this.status = notification.status;
    this.notificationByLocales = notification.notificationByLocales;
    this.specificEmails = notification.specificEmails;
  }
}
