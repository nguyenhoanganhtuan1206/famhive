import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { RewardService } from '../reward.service';

export class DecreaseRewardForUsersCommand implements ICommand {
  constructor(
    public readonly userIds: Uuid[],
    public readonly amount: number,
  ) {}
}

@CommandHandler(DecreaseRewardForUsersCommand)
export class DecreaseRewardForUsersHandler
  implements ICommandHandler<DecreaseRewardForUsersCommand, void>
{
  constructor(private readonly rewardService: RewardService) {}

  async execute(command: DecreaseRewardForUsersCommand): Promise<void> {
    await this.rewardService.decreaseRewardForUsers(
      command.userIds,
      command.amount,
    );
  }
}
