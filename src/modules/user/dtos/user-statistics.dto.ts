/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class UsersStatisticByTimeDto {
  @ApiProperty()
  time: string;

  @ApiProperty()
  totalNewUsers: number;

  @ApiProperty()
  totalMonthlyPremiumNewUsers: number;

  @ApiProperty()
  totalAnnuallyPremiumNewUsers: number;

  @ApiProperty()
  totalNormalNewUsers: number;

  constructor(data: UsersStatisticByTimeDto) {
    this.time = data.time;
    this.totalNewUsers = Number(data.totalNewUsers || 0);
    this.totalMonthlyPremiumNewUsers = Number(
      data.totalMonthlyPremiumNewUsers || 0,
    );
    this.totalAnnuallyPremiumNewUsers = Number(
      data.totalAnnuallyPremiumNewUsers || 0,
    );
    this.totalNormalNewUsers = Number(data.totalNormalNewUsers || 0);
  }
}

export class DayStatisticDto {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalMonthlyPremiumUsers: number;

  @ApiProperty()
  totalAnnuallyPremiumUsers: number;

  @ApiProperty()
  totalNormalUsers: number;

  constructor(data: DayStatisticDto) {
    this.date = data.date;
    this.totalUsers = Number(data.totalUsers || 0);
    this.totalMonthlyPremiumUsers = Number(data.totalMonthlyPremiumUsers || 0);
    this.totalAnnuallyPremiumUsers = Number(
      data.totalAnnuallyPremiumUsers || 0,
    );
    this.totalNormalUsers = Number(data.totalNormalUsers || 0);
  }
}

export class UserStatisticsDto {
  @ApiProperty()
  statisticInFirstDayOfPeriod: DayStatisticDto;

  @ApiProperty()
  statisticInLastDayOfPeriod: DayStatisticDto;

  @ApiProperty()
  growthRate: number;

  @ApiProperty({ type: UsersStatisticByTimeDto, isArray: true })
  statistics: UsersStatisticByTimeDto[];

  constructor(data: UserStatisticsDto) {
    this.statisticInFirstDayOfPeriod = new DayStatisticDto(
      data.statisticInFirstDayOfPeriod,
    );
    this.statisticInLastDayOfPeriod = new DayStatisticDto(
      data.statisticInLastDayOfPeriod,
    );

    this.growthRate = data.growthRate || 0;
    this.statistics = data.statistics.map(
      (it) => new UsersStatisticByTimeDto(it),
    );
  }
}
