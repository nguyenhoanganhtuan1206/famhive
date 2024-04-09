import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

import { NotificationService } from '../notification.service';

@Injectable()
export class NotificationCron {
  constructor(private notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleAddCronjobForScheduledNotifications(): Promise<void> {
    Logger.log('Add cronjob for scheduled notifications at 1AM everyday');
    await this.notificationService.handleAddCronjobForScheduledNotifications();
  }

  // Run this job after 5s when server restart
  @Timeout(5000)
  async handleWhenServerStart(): Promise<void> {
    Logger.log('Add cronjob for scheduled notifications when server restart');
    await this.notificationService.handleAddCronjobForScheduledNotifications();
  }
}
