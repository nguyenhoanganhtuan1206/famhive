import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { DateFieldOptional, EnumFieldOptional } from '../../../decorators';
import { NotificationStatusType } from '../../../modules/notification/types/notification-status.type';
import { AnnouncementForUserType } from '../constants/announcement-for-user-type';

export class GetAnnouncementsDto extends PageOptionsDto {
  @DateFieldOptional()
  fromDate?: Date;

  @DateFieldOptional()
  toDate?: Date;

  @EnumFieldOptional(() => AnnouncementForUserType)
  to?: AnnouncementForUserType;

  @EnumFieldOptional(() => NotificationStatusType)
  status?: NotificationStatusType;
}
