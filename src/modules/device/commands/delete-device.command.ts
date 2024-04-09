import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { DeviceService } from '../device.service';

export class DeleteDeviceCommand implements ICommand {
  constructor(
    public readonly user_id: Uuid,
    public readonly identifier: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteFamilyCommandHandler
  implements ICommandHandler<DeleteDeviceCommand>
{
  constructor(private deviceService: DeviceService) {}

  async execute(command: DeleteDeviceCommand) {
    await this.deviceService.delete(command.user_id, command.identifier);
  }
}
