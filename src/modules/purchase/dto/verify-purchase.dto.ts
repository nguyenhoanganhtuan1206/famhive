import { ApiProperty } from '@nestjs/swagger';

import type { IPurchaseInfo } from '../purchase-info';

export class VerifyPurchaseDto {
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

  constructor(purchaseInfo: IPurchaseInfo) {
    this.transactionId = purchaseInfo.transactionId;
    this.originalTransactionId = purchaseInfo.originalTransactionId;
    this.productId = purchaseInfo.productId;
    this.autoRenewProductId = purchaseInfo.autoRenewProductId;
    this.autoRenewStatus = purchaseInfo.autoRenewStatus;
    this.purchaseDate = purchaseInfo.purchaseDate;
    this.originalPurchaseDate = purchaseInfo.originalPurchaseDate;
    this.expiresDate = purchaseInfo.expiresDate;
  }
}
