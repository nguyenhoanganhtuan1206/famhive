import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { GiftRedemptionDto } from '../dto/gift-redemption.dto';
import { GiftRedemptionHistoryEntity } from '../entities/gift-redemption-history.entity';

export class GetGiftRedemptionHistoriesCommand implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@CommandHandler(GetGiftRedemptionHistoriesCommand)
export class GetGiftRedemptionHistoriesHandler
  implements
    ICommandHandler<GetGiftRedemptionHistoriesCommand, GiftRedemptionDto[]>
{
  constructor(
    @InjectRepository(GiftRedemptionHistoryEntity)
    private giftRedemptionHistoryRepository: Repository<GiftRedemptionHistoryEntity>,
  ) {}

  async execute(
    command: GetGiftRedemptionHistoriesCommand,
  ): Promise<GiftRedemptionDto[]> {
    const giftRedemptionHistories =
      await this.giftRedemptionHistoryRepository.find({
        where: {
          assignees: [{ id: command.userId }],
        },
        order: {
          createdAt: 'DESC',
        },
      });

    return giftRedemptionHistories.toDtos();
  }
}
