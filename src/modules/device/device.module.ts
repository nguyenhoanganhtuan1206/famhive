import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsService } from '../../shared/services/notification.service';
import { DeleteFamilyCommandHandler } from './commands/delete-device.command';
import { GetDeviceTimeZoneOffsetByUserIdHandler } from './commands/get-device-time-zone-offset-by-user-id.command';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceEntity } from './entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    NotificationsService,
    DeleteFamilyCommandHandler,
    GetDeviceTimeZoneOffsetByUserIdHandler,
  ],
})
export class DeviceModule {}
