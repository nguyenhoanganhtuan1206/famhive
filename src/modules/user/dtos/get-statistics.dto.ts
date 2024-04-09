import { StatisticsBy } from '../../../constants';
import { DateField, EnumField, StringField } from '../../../decorators';

export class GetStatisticsDto {
  @DateField()
  fromDate: Date;

  @DateField()
  toDate: Date;

  @StringField({ example: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @EnumField(() => StatisticsBy)
  statisticsBy: StatisticsBy;
}
