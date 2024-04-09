import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetGiftRedemptionHistoriesHandler } from './commands/get-gift-redemption-histories.command';
import { GiftEntity } from './entities/gift.entity';
import { GiftRedemptionHistoryEntity } from './entities/gift-redemption-history.entity';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { GiftRedemptionController } from './gift-redemption.controller';
import { GiftRedemptionService } from './gift-redemption.service';

const handlers = [GetGiftRedemptionHistoriesHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftEntity, GiftRedemptionHistoryEntity]),
  ],
  providers: [GiftService, GiftRedemptionService, ...handlers],
  controllers: [GiftController, GiftRedemptionController],
})
export class GiftModule {}
