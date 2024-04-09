import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { RewardService } from '../reward.service';

export class IncreaseRewardForUserCommand implements ICommand {
  constructor(public readonly userId: Uuid, public readonly amount: number) {}
}

@CommandHandler(IncreaseRewardForUserCommand)
export class IncreaseRewardForUserHandler
  implements ICommandHandler<IncreaseRewardForUserCommand, void>
{
  constructor(private readonly rewardService: RewardService) {}

  async execute(command: IncreaseRewardForUserCommand): Promise<void> {
    await this.rewardService.increaseRewardForUser(
      command.userId,
      command.amount,
    );
  }
}
