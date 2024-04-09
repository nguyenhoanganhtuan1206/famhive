import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddAwardHistoryHandler } from './commands/add-award-history.command';
import { DecreaseRewardForUsersHandler } from './commands/decrease-reward-for-users.command';
import { IncreaseRewardForUserHandler } from './commands/increase-reward-for-user.command';
import { IncreaseTotalRedeemedForUsersHandler } from './commands/increase-total-redeemed-for-users.command';
import { RedemptionHistoryEntity } from './entities/redemption-history.entity';
import { RewardSummaryEntity } from './entities/reward-summary.entity';
import { RedemptionController } from './redemption.controller';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { ScoreController } from './score.controller';

const handlers = [
  IncreaseRewardForUserHandler,
  DecreaseRewardForUsersHandler,
  AddAwardHistoryHandler,
  IncreaseTotalRedeemedForUsersHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardSummaryEntity, RedemptionHistoryEntity]),
  ],
  controllers: [RewardController, RedemptionController, ScoreController],
  providers: [RewardService, ...handlers],
})
export class RewardModule {}
