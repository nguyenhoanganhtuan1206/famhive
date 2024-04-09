import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { DateFieldOptional, EnumFieldOptional } from '../../../decorators';
import { NotificationStatusType } from '../../notification/types/notification-status.type';
import { AnnouncementForUserType } from '../constants/announcement-for-user-type';

export class AnnouncementsQuery extends PageOptionsDto {
  @DateFieldOptional()
  fromDate?: Date;

  @DateFieldOptional()
  toDate?: Date;

  @EnumFieldOptional(() => AnnouncementForUserType)
  to?: AnnouncementForUserType;

  @EnumFieldOptional(() => NotificationStatusType)
  status?: NotificationStatusType;
}
