import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeviceEntity } from '../entities/device.entity';

export class GetDeviceTimeZoneOffsetByUserIdCommand implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@CommandHandler(GetDeviceTimeZoneOffsetByUserIdCommand)
export class GetDeviceTimeZoneOffsetByUserIdHandler
  implements ICommandHandler<GetDeviceTimeZoneOffsetByUserIdCommand, number>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
  ) {}

  async execute(command: GetDeviceTimeZoneOffsetByUserIdCommand) {
    const lastDevice = await this.deviceRepository.findOne({
      where: {
        userId: command.userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    return lastDevice?.timezoneOffset ?? 0;
  }
}
