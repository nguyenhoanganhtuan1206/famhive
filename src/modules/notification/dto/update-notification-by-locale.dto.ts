import { PartialType } from '@nestjs/swagger';

import { IsNullable, UUIDFieldOptional } from '../../../decorators';
import { CreateNotificationByLocaleDto } from './create-notification-by-locale.dto';

export class UpdateNotificationByLocaleDto extends PartialType(
  CreateNotificationByLocaleDto,
) {
  @IsNullable()
  @UUIDFieldOptional()
  id?: Uuid;
}
