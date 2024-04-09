import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PurchaseEntity } from '../entities/purchase.entity';

export class PurchaseInfoDto extends AbstractDto {
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

  constructor(purchaseEntity: PurchaseEntity) {
    super(purchaseEntity);

    this.transactionId = purchaseEntity.transactionId;
    this.originalTransactionId = purchaseEntity.originalTransactionId;
    this.productId = purchaseEntity.productId;
    this.autoRenewProductId = purchaseEntity.autoRenewProductId;
    this.autoRenewStatus = purchaseEntity.autoRenewStatus;
    this.purchaseDate = purchaseEntity.purchaseDate;
    this.originalPurchaseDate = purchaseEntity.originalPurchaseDate;
    this.expiresDate = purchaseEntity.expiresDate;
  }
}
