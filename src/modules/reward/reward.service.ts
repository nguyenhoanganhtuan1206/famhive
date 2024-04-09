import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import type { FindOptionsWhere } from 'typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AwardHistoryType } from '../../constants/award-history-type';
import { GetGiftRedemptionHistoriesCommand } from '../gift/commands/get-gift-redemption-histories.command';
import { FindUsersByCommand } from '../user/commands/find-user-by.command';
import { UserEntity } from '../user/user.entity';
import type { CreateAwardHistoryDto } from './dto/create-award-history.dto';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { RedemptionHistoryEntity } from './entities/redemption-history.entity';
import { RewardSummaryEntity } from './entities/reward-summary.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(RewardSummaryEntity)
    private rewardSummaryRepository: Repository<RewardSummaryEntity>,
    @InjectRepository(RedemptionHistoryEntity)
    private redemptionHistoryRepository: Repository<RedemptionHistoryEntity>,
    private commandBus: CommandBus,
  ) {}

  async increaseRewardForUser(
    userId: Uuid,
    amount: number,
  ): Promise<RewardSummaryEntity> {
    const rewardSummary = await this.findRewardSummary(userId);

    // update summary
    if (rewardSummary) {
      rewardSummary.totalReceived += amount;

      return this.rewardSummaryRepository.save(rewardSummary);
    }

    // create new summary for user
    // when creating summary then totalRedeemed, totalDeducted always equal 0
    return this.rewardSummaryRepository.save(
      this.rewardSummaryRepository.create({
        userId,
        totalReceived: amount,
        totalRedeemed: 0,
        totalDeducted: 0,
      }),
    );
  }

  async decreaseRewardForUsers(userIds: Uuid[], amount: number) {
    const rewardSummaries = await this.findRewardSummariesBy({
      userId: In(userIds),
    });

    // check remaining for reward summaries
    for (const rewardSummary of rewardSummaries) {
      const totalRemainingAward = this.getTotalRemainingAward(rewardSummary);

      if (totalRemainingAward - amount < 0) {
        throw new BadRequestException('The remaining awards are not enough');
      }

      rewardSummary.totalReceived -= amount;
    }

    // update reward summaries
    await Promise.all(
      rewardSummaries.map((rewardSummary) =>
        this.rewardSummaryRepository.save(rewardSummary),
      ),
    );
  }

  async updateTotalRedeemedForUser(userId: Uuid, amount: number) {
    const rewardSummary = await this.findRewardSummary(userId);

    if (!rewardSummary) {
      throw new BadRequestException(`Not found any user's reward`);
    }

    this.checkRemainingAwardsStatus(rewardSummary, amount);
    rewardSummary.totalRedeemed += amount;

    return this.rewardSummaryRepository.save(rewardSummary);
  }

  async increaseTotalRedeemedForUsers(userIds: Uuid[], amount: number) {
    const rewardSummaries = await this.findRewardSummariesBy({
      userId: In(userIds),
    });

    if (_.size(rewardSummaries) !== _.size(userIds)) {
      throw new BadRequestException('The remaining awards are not enough');
    }

    // check remaining for reward summaries
    for (const rewardSummary of rewardSummaries) {
      const totalRemainingAward = this.getTotalRemainingAward(rewardSummary);

      if (totalRemainingAward - amount < 0) {
        throw new BadRequestException('The remaining awards are not enough');
      }

      rewardSummary.totalRedeemed += amount;
    }

    // update reward summaries
    await Promise.all(
      rewardSummaries.map((rewardSummary) =>
        this.rewardSummaryRepository.save(rewardSummary),
      ),
    );
  }

  async updateTotalDeductedForUser(userId: Uuid, amount: number) {
    const rewardSummary = await this.findRewardSummary(userId);

    if (!rewardSummary) {
      throw new BadRequestException(`Not found any user's reward`);
    }

    this.checkRemainingAwardsStatus(rewardSummary, amount);
    rewardSummary.totalDeducted += amount;

    return this.rewardSummaryRepository.save(rewardSummary);
  }

  private async findRewardSummary(userId: Uuid) {
    return this.rewardSummaryRepository.findOne({
      where: { userId },
    });
  }

  private async findRewardSummariesBy(
    where: FindOptionsWhere<RewardSummaryEntity>,
  ) {
    return this.rewardSummaryRepository.findBy(where);
  }

  async getMemberRewards(user: UserEntity) {
    // get all members of family
    const familyMembers = await this.commandBus.execute(
      new FindUsersByCommand({
        familyId: user.familyId,
      }),
    );

    // get reward summaries of family
    const data = await this.rewardSummaryRepository.find({
      where: {
        user: {
          familyId: user.familyId,
        },
      },
    });
    const dataMap = _.keyBy(data, 'userId');

    // mapping rewards summary and member
    const result = familyMembers.map((member) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (dataMap[member.id]) {
        dataMap[member.id].user = member;

        return dataMap[member.id].toDto();
      }

      // there may be some users who do not have reward summary
      return this.rewardSummaryRepository
        .create({
          user: member,
          totalRedeemed: 0,
          totalReceived: 0,
          totalDeducted: 0,
        })
        .toDto();
    });

    return _.orderBy(
      result,
      [
        (x) => x.totalReceived - x.totalDeducted,
        (x) => x.remaining,
        (x) => x.fullName,
      ],
      ['desc', 'desc', 'asc'],
    );
  }

  // Add history when earned from finished TODO or revoked when redo TODO
  async createAwardHistory(
    createdById: Uuid,
    awardHistoryDto: CreateAwardHistoryDto,
  ) {
    return this.redemptionHistoryRepository.save(
      this.redemptionHistoryRepository.create({
        ...awardHistoryDto,
        createdById,
      }),
    );
  }

  @Transactional()
  async createRedemption(
    user: UserEntity,
    createRedeemDto: CreateRedemptionDto,
  ) {
    // check and update redeem before request redeem will be created
    await this.updateTotalRedeemedForUser(
      createRedeemDto.userId,
      createRedeemDto.amount,
    );

    return this.redemptionHistoryRepository.save(
      this.redemptionHistoryRepository.create({
        ...createRedeemDto,
        createdById: user.id,
        type: AwardHistoryType.REDEEMED,
      }),
    );
  }

  @Transactional()
  async createDeduction(
    user: UserEntity,
    createDeductDto: CreateRedemptionDto,
  ) {
    // check and update deduct before request deduct will be created
    await this.updateTotalDeductedForUser(
      createDeductDto.userId,
      createDeductDto.amount,
    );

    return this.redemptionHistoryRepository.save(
      this.redemptionHistoryRepository.create({
        ...createDeductDto,
        createdById: user.id,
        type: AwardHistoryType.DEDUCTED,
      }),
    );
  }

  async getRedemptionHistoriesByUserId(userId: Uuid) {
    const histories = await this.redemptionHistoryRepository.find({
      where: { userId, type: AwardHistoryType.REDEEMED },
      order: {
        createdAt: 'DESC',
      },
    });

    const giftRedemptionHistories = await this.commandBus.execute(
      new GetGiftRedemptionHistoriesCommand(userId),
    );

    const data = [
      ...histories.map((x) => x.toDto()),
      ...giftRedemptionHistories.map((x) => x.toRedemptionHistories()),
    ];

    return _.orderBy(data, ['createdAt'], ['desc']);
  }

  async getScoreHistoriesByUserId(userId: Uuid) {
    const histories = await this.redemptionHistoryRepository.find({
      where: {
        userId,
        type: In([
          AwardHistoryType.EARNED,
          AwardHistoryType.DEDUCTED,
          AwardHistoryType.REVOKED,
        ]),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return histories.map((x) => x.toDto());
  }

  private checkRemainingAwardsStatus(
    rewardSummary: RewardSummaryEntity,
    amount: number,
  ) {
    const totalRemainingAward = this.getTotalRemainingAward(rewardSummary);

    if (totalRemainingAward < amount) {
      throw new BadRequestException('The remaining awards are not enough');
    }
  }

  private getTotalRemainingAward(rewardSummary: RewardSummaryEntity) {
    const { totalReceived, totalDeducted, totalRedeemed } = rewardSummary;

    return totalReceived - totalDeducted - totalRedeemed;
  }
}
