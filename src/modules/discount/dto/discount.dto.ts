import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DiscountSubscriptionPlanType } from '../constants/discount-subscription-plan-type';
import type { DiscountEntity } from '../entities/discount.entity';

export class DiscountDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty({ enum: DiscountSubscriptionPlanType })
  subscriptionPlan: DiscountSubscriptionPlanType;

  @ApiProperty()
  startDateTime: Date;

  @ApiProperty()
  endDateTime: Date;

  constructor(discount: DiscountEntity) {
    super(discount);
    this.name = discount.name;
    this.enabled = discount.enabled;
    this.discountPercentage = discount.discountPercentage;
    this.subscriptionPlan = discount.subscriptionPlan;
    this.startDateTime = discount.startDateTime;
    this.endDateTime = discount.endDateTime;
  }
}
