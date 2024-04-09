import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleService } from '../../shared/services/schedule.service';
import { BalanceHistoryService } from './balance-history.service';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { ChoreController } from './chore.controller';
import { ChoreService } from './chore.service';
import { ChoreDoneService } from './chore-done.service';
import { BalanceHistoryEntity } from './entities/balance-history.entity';
import { ChoreEntity } from './entities/chore.entity';
import { ChoreDoneEntity } from './entities/chore-done.entity';
import { ChorePriceHistoryEntity } from './entities/chore-price-history.entity';
import { UserBalanceController } from './user.balance.controller';
import { UserChoreController } from './user.chore.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChoreEntity,
      ChoreDoneEntity,
      ChorePriceHistoryEntity,
      BalanceHistoryEntity,
    ]),
  ],
  controllers: [
    ChoreController,
    UserBalanceController,
    ChartController,
    UserChoreController,
  ],
  providers: [
    ChoreService,
    ChoreDoneService,
    BalanceHistoryService,
    ChartService,
    ScheduleService,
  ],
})
export class ChoreModule {}
