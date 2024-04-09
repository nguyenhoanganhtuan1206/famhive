import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { RewardService } from '../reward.service';

export class IncreaseTotalRedeemedForUsersCommand implements ICommand {
  constructor(
    public readonly userIds: Uuid[],
    public readonly amount: number,
  ) {}
}

@CommandHandler(IncreaseTotalRedeemedForUsersCommand)
export class IncreaseTotalRedeemedForUsersHandler
  implements ICommandHandler<IncreaseTotalRedeemedForUsersCommand, void>
{
  constructor(private readonly rewardService: RewardService) {}

  async execute(command: IncreaseTotalRedeemedForUsersCommand): Promise<void> {
    await this.rewardService.increaseTotalRedeemedForUsers(
      command.userIds,
      command.amount,
    );
  }
}
