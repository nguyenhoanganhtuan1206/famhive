import { ApiProperty } from '@nestjs/swagger';
import _ from 'lodash';

class UserStatisticNewPerDayItem {
  @ApiProperty()
  time?: Date;

  @ApiProperty()
  label?: string;

  @ApiProperty()
  total: number;

  constructor(data: Partial<UserStatisticNewPerDayItem>) {
    this.time = data.time;
    this.label = data.label;
    this.total = _.toNumber(data.total) || 0;
  }
}

export class UserStatisticsNewPerDayDto {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: UserStatisticNewPerDayItem, isArray: true })
  data: UserStatisticNewPerDayItem[];

  constructor(listData: Array<Partial<UserStatisticNewPerDayItem>>) {
    this.data = listData.map((item) => new UserStatisticNewPerDayItem(item));
    this.total = _.sumBy(this.data, (x) => x.total);
  }
}
