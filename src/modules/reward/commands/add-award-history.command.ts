import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { CreateAwardHistoryDto } from '../dto/create-award-history.dto';
import { RewardService } from '../reward.service';

export class AddAwardHistoryCommand implements ICommand {
  constructor(
    public readonly createdById: Uuid,
    public readonly historyData: CreateAwardHistoryDto,
  ) {}
}

@CommandHandler(AddAwardHistoryCommand)
export class AddAwardHistoryHandler
  implements ICommandHandler<AddAwardHistoryCommand, void>
{
  constructor(private readonly rewardService: RewardService) {}

  async execute(command: AddAwardHistoryCommand): Promise<void> {
    await this.rewardService.createAwardHistory(
      command.createdById,
      command.historyData,
    );
  }
}
