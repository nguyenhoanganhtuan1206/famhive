import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { NotificationsService } from '../../shared/services/notification.service';
import { ScheduleService } from '../../shared/services/schedule.service';
import { CreateOfficialEventHandler } from './commands/create-official-event.command';
import { CreateUpdateDobEventHandler } from './commands/create-update-dob-event.command';
import { DeleteBirthdayByUsersHandler } from './commands/delete-birthday-by-users.command';
import { EventEntity } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventCron } from './event.cron';
import { EventService } from './event.service';

const handlers = [
  CreateOfficialEventHandler,
  CreateUpdateDobEventHandler,
  DeleteBirthdayByUsersHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  controllers: [EventController],
  providers: [
    EventService,
    NotificationsService,
    ApiConfigService,
    EventCron,
    ScheduleService,
    ...handlers,
  ],
})
export class EventModule {}
