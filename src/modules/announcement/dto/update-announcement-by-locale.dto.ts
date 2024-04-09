import { PartialType } from '@nestjs/swagger';

import { IsNullable, UUIDFieldOptional } from '../../../decorators';
import { CreateAnnouncementByLocaleDto } from './create-announcement-by-locale.dto';

export class UpdateAnnouncementByLocaleDto extends PartialType(
  CreateAnnouncementByLocaleDto,
) {
  @IsNullable()
  @UUIDFieldOptional()
  id?: Uuid;
}
