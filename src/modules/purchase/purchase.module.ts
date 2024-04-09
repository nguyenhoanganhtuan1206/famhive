import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppstoreClient } from './appstore.client';
import { FindFamilyInPurchaseCommandHandler } from './commands/find-family.command';
import { FindFamilyPurchaseCommandHandler } from './commands/find-family-purchase.command';
import { FindLatestFamilyPurchaseCommandHandler } from './commands/find-latest-family-purchase.command';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity])],
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    AppstoreClient,
    FindFamilyPurchaseCommandHandler,
    FindLatestFamilyPurchaseCommandHandler,
    FindFamilyInPurchaseCommandHandler,
  ],
  exports: [PurchaseService],
})
export class PurchaseModule {}
