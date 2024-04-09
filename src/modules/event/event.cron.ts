import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { getCurrentDateInUTC } from '../../utils/date.utils';
import { EventService } from './event.service';

@Injectable()
export class EventCron {
  constructor(
    private eventService: EventService,
    private schedulerRegistry: SchedulerRegistry,
    private apiConfigService: ApiConfigService,
  ) {}

  @Timeout(5000)
  bootstrap(): void {
    const cronSchedule =
      this.apiConfigService.cronSchedule.EVENT_REMINDER_SCHEDULE;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const job = new CronJob(cronSchedule, async () => {
      await this.eventService.remindUpcommingEvents(getCurrentDateInUTC());
    });

    this.schedulerRegistry.addCronJob('Upcomming events', job);
    job.start();
    Logger.log('Started event reminding cronjob');
  }
}
