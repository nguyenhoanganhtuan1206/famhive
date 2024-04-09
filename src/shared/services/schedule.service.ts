import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import type { Dayjs } from 'dayjs';
import type { DateTime } from 'luxon';

@Injectable()
export class ScheduleService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(
    name: string,
    dateTime: string | Date | DateTime | Dayjs,
    func: () => void,
  ) {
    this.removeCronjob(name);

    try {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const job = new CronJob(new Date(dateTime.toString()), func);

      this.schedulerRegistry.addCronJob(name, job);
      job.start();

      Logger.log(`Job ${name} added to run at ${dateTime}`);
    } catch (error) {
      Logger.log(`Job ${name} error: ${error}`);
    }
  }

  removeCronjob(name: string) {
    const hasJob = this.schedulerRegistry.doesExist('cron', name);

    if (hasJob) {
      try {
        this.schedulerRegistry.deleteCronJob(name);
      } catch (error) {
        Logger.log(`Delete job ${name} error: ${error}`);
      }
    }
  }
}
