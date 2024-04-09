import { DateField } from '../../../decorators';

export class GetEventsDto {
  @DateField()
  fromDate: Date;

  @DateField()
  toDate: Date;
}
