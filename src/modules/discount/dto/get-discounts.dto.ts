import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { DateFieldOptional, EnumFieldOptional } from '../../../decorators';
import { NotificationStatusType } from '../../notification/types/notification-status.type';
import { DiscountSubscriptionPlanType } from '../constants/discount-subscription-plan-type';

export class GetDiscountsDto extends PageOptionsDto {
  @DateFieldOptional()
  fromDate?: Date;

  @DateFieldOptional()
  toDate?: Date;

  @EnumFieldOptional(() => DiscountSubscriptionPlanType)
  subscriptionPlan?: DiscountSubscriptionPlanType;

  @EnumFieldOptional(() => NotificationStatusType)
  status?: NotificationStatusType;
}
