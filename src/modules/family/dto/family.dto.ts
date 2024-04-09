import { ApiProperty } from '@nestjs/swagger';

import type { FamilyEntity } from '../entities/family.entity';

export class FamilyDto {
  @ApiProperty()
  transactionId?: string;

  @ApiProperty()
  originalTransactionId?: string;

  @ApiProperty()
  productId?: string;

  @ApiProperty()
  autoRenewProductId?: string;

  @ApiProperty()
  autoRenewStatus?: boolean;

  @ApiProperty()
  purchaseDate?: Date;

  @ApiProperty()
  originalPurchaseDate?: Date;

  @ApiProperty()
  expiresDate?: Date;

  @ApiProperty()
  isPremium: boolean;

  @ApiProperty()
  rewardType: string;

  constructor(family: FamilyEntity, isPremium: boolean) {
    this.transactionId = family.transactionId;
    this.originalTransactionId = family.originalTransactionId;
    this.productId = family.productId;
    this.autoRenewProductId = family.autoRenewProductId;
    this.purchaseDate = family.purchaseDate;
    this.originalPurchaseDate = family.originalPurchaseDate;
    this.expiresDate = family.expiresDate;
    this.rewardType = family.rewardType;

    this.isPremium = isPremium;
  }
}
