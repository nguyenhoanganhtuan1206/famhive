import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import {
  BooleanFieldOptional,
  DateFieldOptional,
  StringFieldOptional,
} from '../../../decorators';

export class UsersPageOptionsDto extends PageOptionsDto {
  @DateFieldOptional()
  fromDate?: Date;

  @DateFieldOptional()
  toDate?: Date;

  @BooleanFieldOptional()
  isActivated?: boolean;

  @BooleanFieldOptional()
  isVerified?: boolean;

  @StringFieldOptional()
  product?: string;
}
