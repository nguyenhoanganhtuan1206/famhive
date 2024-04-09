import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleService } from '../../shared/services/schedule.service';
import { NotificationsService as SharedNotificationService } from './../../shared/services/notification.service';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationByLocaleEntity } from './entities/notification-by-locale.entity';
import { NotificationCron } from './jobs/notification.cron';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationByLocaleEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    SharedNotificationService,
    NotificationCron,
    ScheduleService,
  ],
})
export class NotificationModule {}
