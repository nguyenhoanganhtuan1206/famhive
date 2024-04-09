import { DateField } from '../../../decorators';

export class GetMealPlannersDto {
  @DateField()
  fromDate: Date;

  @DateField()
  toDate: Date;
}
