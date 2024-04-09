import {
  BooleanField,
  DateField,
  EnumFieldOptional,
  NumberField,
  StringField,
} from '../../../decorators';
import { DiscountSubscriptionPlanType } from '../constants/discount-subscription-plan-type';

export class CreateDiscountDto {
  @StringField()
  name: string;

  @NumberField({ min: 0 })
  discountPercentage: number;

  @BooleanField()
  enabled: boolean;

  @EnumFieldOptional(() => DiscountSubscriptionPlanType)
  subscriptionPlan: DiscountSubscriptionPlanType;

  @DateField()
  startDateTime: Date;

  @DateField()
  endDateTime: Date;
}
