import { NotFoundException } from '@nestjs/common';
import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UserConfigurationDto } from '../dtos/user-configuration.dto';
import { UserConfigurationEntity } from '../user-configuration.entity';

export class UpdateUserConfigurationCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly userConfigurationDto: UserConfigurationDto,
  ) {}
}

@CommandHandler(UpdateUserConfigurationCommand)
export class UpdateUserConfigurationHandler
  implements
    ICommandHandler<UpdateUserConfigurationCommand, UserConfigurationEntity>
{
  constructor(
    @InjectRepository(UserConfigurationEntity)
    private userConfigurationRepository: Repository<UserConfigurationEntity>,
  ) {}

  async execute(command: UpdateUserConfigurationCommand) {
    const { userId, userConfigurationDto } = command;

    const existing = await this.userConfigurationRepository.findOne({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException(`User configuration was not found!`);
    }

    return this.userConfigurationRepository.save({
      ...existing,
      ...userConfigurationDto,
    });
  }
}
