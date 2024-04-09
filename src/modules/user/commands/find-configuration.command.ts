import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserConfigurationEntity } from '../user-configuration.entity';

export class FindUserConfigurationCommand implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@CommandHandler(FindUserConfigurationCommand)
export class FindUserConfigurationHandler
  implements
    ICommandHandler<FindUserConfigurationCommand, UserConfigurationEntity>
{
  constructor(
    @InjectRepository(UserConfigurationEntity)
    private userConfigurationRepository: Repository<UserConfigurationEntity>,
  ) {}

  async execute(command: FindUserConfigurationCommand) {
    const userConfiguration = await this.userConfigurationRepository.findOne({
      where: { userId: command.userId },
    });

    if (userConfiguration) {
      return userConfiguration;
    }

    const userConfigurationEntity = this.userConfigurationRepository.create({
      isShowTaskDone: true,
      isShowTodoDone: true,
    });
    userConfigurationEntity.userId = command.userId;

    return this.userConfigurationRepository.save(userConfigurationEntity);
  }
}
