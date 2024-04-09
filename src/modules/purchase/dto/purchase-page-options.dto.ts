import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { StringFieldOptional } from '../../../decorators';

export class PurchasePageOptionsDto extends PageOptionsDto {
  @StringFieldOptional()
  product?: string;
}
