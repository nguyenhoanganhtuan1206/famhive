import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TodoService } from './todo.service';

@Injectable()
export class TodoCron {
  constructor(private todoService: TodoService) {}

  @Cron('0 12 * * 6')
  async remindOverdueTasksAtWeekend(): Promise<void> {
    await this.todoService.sendOverdueTasksToCorrespondingEmail();
  }
}
