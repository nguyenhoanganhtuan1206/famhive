import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationForType } from '../types/notification-for.type';
import { NotificationStatusType } from '../types/notification-status.type';
import { NotificationType } from '../types/notification-type';
import { NotificationByLocaleEntity } from './notification-by-locale.entity';

@Entity('notifications')
@UseDto(NotificationDto)
export class NotificationEntity extends AbstractEntity<NotificationDto> {
  @Column({
    type: 'enum',
    enum: NotificationForType,
    default: NotificationForType.ALL_USER,
  })
  to: NotificationForType;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.EMAIL,
  })
  type: NotificationType;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  specificEmails: string[];

  @Column()
  scheduledDateTime: Date;

  @Column({
    type: 'enum',
    enum: NotificationStatusType,
    default: NotificationStatusType.PENDING,
  })
  status: NotificationStatusType;

  @OneToMany(
    () => NotificationByLocaleEntity,
    (notificationByLocale) => notificationByLocale.notification,
    {
      cascade: true,
    },
  )
  notificationByLocales: NotificationByLocaleEntity[];
}
