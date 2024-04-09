import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { IncreaseTotalRedeemedForUsersCommand } from '../reward/commands/increase-total-redeemed-for-users.command';
import { FindUsersByCommand } from '../user/commands/find-user-by.command';
import { UserEntity } from '../user/user.entity';
import { RedeemGiftDto } from './dto/redeem-gift.dto';
import { GiftRedemptionHistoryEntity } from './entities/gift-redemption-history.entity';
import { GiftService } from './gift.service';

@Injectable()
export class GiftRedemptionService {
  constructor(
    @InjectRepository(GiftRedemptionHistoryEntity)
    private readonly giftRedemptionHistoryRepository: Repository<GiftRedemptionHistoryEntity>,
    private readonly giftService: GiftService,
    private readonly commandBus: CommandBus,
  ) {}

  findRedeemHistories(user: UserEntity) {
    return this.giftRedemptionHistoryRepository.find({
      where: {
        familyId: user.familyId,
      },
      order: {
        createdAt: 'desc',
      },
      relations: {
        assignees: true,
      },
    });
  }

  @Transactional()
  async redeemGift(user: UserEntity, redeemGiftDto: RedeemGiftDto) {
    const gift = await this.giftService.findOne(user, redeemGiftDto.giftId);

    // check and update total redeemed star for all assignees
    await this.commandBus.execute(
      new IncreaseTotalRedeemedForUsersCommand(
        redeemGiftDto.assigneeIds,
        gift.star,
      ),
    );

    const assignees = await this.commandBus.execute(
      new FindUsersByCommand({
        id: In(redeemGiftDto.assigneeIds),
      }),
    );

    if (assignees.length < redeemGiftDto.assigneeIds.length) {
      throw new BadRequestException('Some assignees are incorrect!');
    }

    await this.giftService.remove(user, gift.id);

    const giftDone = this.giftRedemptionHistoryRepository.create({
      title: gift.title,
      star: gift.star,
      assignees,
      familyId: gift.familyId,
      createdById: gift.createdById,
    });

    return this.giftRedemptionHistoryRepository.save(giftDone);
  }
}
