import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UserConfigurationDto } from '../dtos/user-configuration.dto';
import { UserConfigurationEntity } from '../user-configuration.entity';

export class CreateUserConfigurationCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly userConfigurationDto: UserConfigurationDto,
  ) {}
}

@CommandHandler(CreateUserConfigurationCommand)
export class CreateUserConfigurationHandler
  implements
    ICommandHandler<CreateUserConfigurationCommand, UserConfigurationEntity>
{
  constructor(
    @InjectRepository(UserConfigurationEntity)
    private userConfigurationRepository: Repository<UserConfigurationEntity>,
  ) {}

  execute(command: CreateUserConfigurationCommand) {
    const { userId, userConfigurationDto } = command;
    const userConfigurationEntity =
      this.userConfigurationRepository.create(userConfigurationDto);
    userConfigurationEntity.userId = userId;

    return this.userConfigurationRepository.save(userConfigurationEntity);
  }
}
