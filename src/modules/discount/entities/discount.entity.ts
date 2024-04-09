import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { DiscountSubscriptionPlanType } from '../constants/discount-subscription-plan-type';
import { DiscountDto } from '../dto/discount.dto';

@Entity({ name: 'discounts' })
@UseDto(DiscountDto)
export class DiscountEntity extends AbstractEntity<DiscountDto> {
  @Column()
  name: string;

  @Column()
  discountPercentage: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'enum', enum: DiscountSubscriptionPlanType })
  subscriptionPlan: DiscountSubscriptionPlanType;

  @Column()
  startDateTime: Date;

  @Column()
  endDateTime: Date;
}
