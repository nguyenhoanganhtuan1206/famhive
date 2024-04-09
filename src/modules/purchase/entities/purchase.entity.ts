import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import { PurchaseInfoDto } from '../dto/purchase-info.dto';
import type { IPurchaseInfo } from '../purchase-info';
import { PaymentPlatform } from './../../../constants/payment-platform';

@Entity({ name: 'purchases' })
@UseDto(PurchaseInfoDto)
export class PurchaseEntity extends AbstractEntity implements IPurchaseInfo {
  @ManyToOne(() => FamilyEntity, (family) => family.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'family_id',
    foreignKeyConstraintName: 'purchase_family_fk',
    referencedColumnName: 'id',
  })
  family: FamilyEntity;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  originalTransactionId?: string;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  autoRenewProductId?: string;

  @Column({ nullable: true })
  autoRenewStatus?: boolean;

  @Column({ nullable: true })
  purchaseDate?: Date;

  @Column({ nullable: true })
  originalPurchaseDate?: Date;

  @Column({ nullable: true })
  expiresDate?: Date;

  @Column({
    type: 'enum',
    enum: PaymentPlatform,
    default: PaymentPlatform.APPLE_PAY,
  })
  paymentPlatform: PaymentPlatform;

  @Column({ nullable: true })
  priceCurrencyCode?: string;

  @Column({ nullable: true })
  priceAmountMicros?: string;

  @Column({ nullable: true })
  countryCode?: string;

  @Column({ nullable: true })
  paymentState?: number;

  @Column({ nullable: true })
  purchaseType?: number;

  @Column({ nullable: true })
  purchaseToken?: string;
}
