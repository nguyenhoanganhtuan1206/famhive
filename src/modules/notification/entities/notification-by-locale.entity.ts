import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LangCode } from '../../../constants';
import { UseDto } from '../../../decorators';
import { NotificationByLocaleDto } from '../dto/notification-by-locale.dto';
import { NotificationEntity } from './notification.entity';

@Entity('notification-by-locales')
@UseDto(NotificationByLocaleDto)
export class NotificationByLocaleEntity extends AbstractEntity<NotificationByLocaleDto> {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  langCode: LangCode;

  @Column()
  notificationId: Uuid;

  @ManyToOne(
    () => NotificationEntity,
    (notification) => notification.notificationByLocales,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    foreignKeyConstraintName: 'fk_notification_by_local_notification',
  })
  notification: NotificationEntity;
}
