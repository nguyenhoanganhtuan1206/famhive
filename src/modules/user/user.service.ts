import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions, FindOptionsWhere } from 'typeorm';
import {
  Between,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { allDateFormats, RoleType } from '../../constants';
import { StatisticUserType } from '../../constants/user-type';
import { UserNotFoundException } from '../../exceptions';
import { endOfDay } from '../../utils/date.utils';
import { BoUserDto } from './dtos/bo-user.dto';
import type { GetStatisticsDto } from './dtos/get-statistics.dto';
import type { UserDto } from './dtos/user.dto';
import type {
  DayStatisticDto,
  UsersStatisticByTimeDto,
} from './dtos/user-statistics.dto';
import { UserStatisticsDto } from './dtos/user-statistics.dto';
import { UserStatisticsNewPerDayDto } from './dtos/user-statistics-new-per-day.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private commandBus: CommandBus,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: findData,
      relations: {
        family: true,
      },
    });
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<BoUserDto>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.family', 'family');

    const {
      isActivated,
      isVerified,
      product,
      fromDate,
      toDate,
      q: queryStr,
      order,
      orderKey = 'createdAt',
    } = pageOptionsDto;

    const acceptanceOrderKeys = [
      'fullName',
      'role',
      'email',
      'phone',
      'birthday',
      'activated',
      'verified',
      'order',
      'createdAt',
      'product',
    ];

    if (orderKey && !acceptanceOrderKeys.includes(orderKey)) {
      throw new BadRequestException(
        `Order key allows one of the values: ${acceptanceOrderKeys.join(', ')}`,
      );
    }

    queryBuilder.andWhere({
      role: In([RoleType.ADMIN, RoleType.SPOUSE]),
    });

    if (queryStr) {
      queryBuilder
        .andWhere({
          fullName: ILike(`%${queryStr}%`),
        })
        .orWhere({
          email: ILike(`%${queryStr}%`),
        });
    }

    if (isActivated !== undefined) {
      queryBuilder.andWhere({
        activated: isActivated,
      });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere({
        verified: isVerified,
      });
    }

    if (product) {
      queryBuilder.andWhere({
        family: {
          productId: product,
        },
      });
    }

    if (fromDate && !toDate) {
      queryBuilder.andWhere({
        createdAt: MoreThanOrEqual(fromDate),
      });
    }

    if (!fromDate && toDate) {
      queryBuilder.andWhere({
        createdAt: LessThanOrEqual(toDate),
      });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere({
        createdAt: Between(fromDate, toDate),
      });
    }

    if (orderKey === 'product') {
      queryBuilder.orderBy(`family.productId`, order);
    } else {
      queryBuilder.orderBy(`user.${orderKey}`, order);
    }

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return {
      data: BoUserDto.toUserDtos(items),
      meta: pageMetaDto,
    };
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async getStatisticsNewPerDay(getStatisticsDto: GetStatisticsDto) {
    const { fromDate, toDate, timezone, statisticsBy } = getStatisticsDto;

    const dataRaw = await this.userRepository
      .createQueryBuilder('user')
      .select(
        `TO_CHAR(created_at at time zone '${timezone}', '${allDateFormats[statisticsBy]}')`,
        'label',
      )
      .addSelect(
        `date_trunc('${statisticsBy}', created_at at time zone '${timezone}')`,
        'time',
      )
      .addSelect('count(id)', 'total')
      .andWhere(
        `TO_TIMESTAMP(
          TO_CHAR(created_at at time zone '${timezone}', '${allDateFormats.day}'), '${allDateFormats.day}
        ') >= TO_TIMESTAMP(:fromDate, '${allDateFormats.day}')
        AND
        TO_TIMESTAMP(
          TO_CHAR(created_at at time zone '${timezone}', '${allDateFormats.day}'), '${allDateFormats.day}
        ') <= TO_TIMESTAMP(:toDate, '${allDateFormats.day}')`,
        {
          fromDate,
          toDate,
        },
      )
      .groupBy('time,label')
      .orderBy('time')
      .getRawMany();

    return new UserStatisticsNewPerDayDto(dataRaw as never);
  }

  async getAdminsActivatedByFamilyIds(
    familyIds: Uuid[],
  ): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        role: RoleType.ADMIN,
        verified: true,
        familyId: In(familyIds),
      },
    });
  }

  async findUserBy(where: FindOptionsWhere<UserEntity>) {
    return this.userRepository.findBy(where);
  }

  async getStatistics(
    getStatisticDto: GetStatisticsDto,
  ): Promise<UserStatisticsDto> {
    const { fromDate, toDate, timezone, statisticsBy } = getStatisticDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select(
        `TO_CHAR(user.created_at at time zone '${timezone}', '${allDateFormats[statisticsBy]}')`,
        'time',
      )
      .addSelect('COUNT(user.id)', 'totalNewUsers')
      .addSelect(
        "SUM(CASE WHEN family.product_id = 'premium.monthly' THEN 1 ELSE 0 END)",
        'totalMonthlyPremiumNewUsers',
      )
      .addSelect(
        "SUM(CASE WHEN family.product_id = 'premium.annually' THEN 1 ELSE 0 END)",
        'totalAnnuallyPremiumNewUsers',
      )
      .addSelect(
        'SUM(CASE WHEN family.product_id IS NULL THEN 1 ELSE 0 END)',
        'totalNormalNewUsers',
      )
      .andWhere(
        `TO_TIMESTAMP(
          TO_CHAR(user.created_at at time zone '${timezone}', '${allDateFormats.day}'),
          '${allDateFormats.day}
        ') >= TO_TIMESTAMP(:fromDate, '${allDateFormats.day}')
        AND
        TO_TIMESTAMP(
          TO_CHAR(user.created_at at time zone '${timezone}', '${allDateFormats.day}'),
          '${allDateFormats.day}
        ') <= TO_TIMESTAMP(:toDate, '${allDateFormats.day}')`,
        {
          fromDate,
          toDate,
        },
      )
      .leftJoin('user.family', 'family')
      .groupBy('time')
      .orderBy('time');

    const statisticInFirstDayOfPeriod = await this.getStatisticByDate(fromDate);
    const statisticInLastDayOfPeriod = await this.getStatisticByDate(toDate);

    const statistics: UsersStatisticByTimeDto[] =
      await queryBuilder.getRawMany();

    let growthRate = 0;

    if (statisticInFirstDayOfPeriod.totalUsers !== 0) {
      const amountDifference =
        statisticInLastDayOfPeriod.totalUsers -
        statisticInFirstDayOfPeriod.totalUsers;
      const ratio =
        (amountDifference / statisticInFirstDayOfPeriod.totalUsers) * 100;
      growthRate = Number(ratio.toFixed(2));
    }

    return new UserStatisticsDto({
      statisticInFirstDayOfPeriod,
      statisticInLastDayOfPeriod,
      growthRate,
      statistics,
    });
  }

  private async getStatisticByDate(date: Date): Promise<DayStatisticDto> {
    const totalUsersInFirstDayOfPeriod = await this.userRepository.count(
      this.getQueryOptionsByUserType(date, StatisticUserType.ALL),
    );
    const totalMonthlyPremiumUsersInFirstDayOfPeriod =
      await this.userRepository.count(
        this.getQueryOptionsByUserType(date, StatisticUserType.MONTHLY_PREMIUM),
      );
    const totalAnnuallyPremiumUsersInFirstDayOfPeriod =
      await this.userRepository.count(
        this.getQueryOptionsByUserType(
          date,
          StatisticUserType.ANNUALLY_PREMIUM,
        ),
      );
    const totalNormalUsersInFirstDayOfPeriod = await this.userRepository.count(
      this.getQueryOptionsByUserType(date, StatisticUserType.NORMAL),
    );

    return {
      date,
      totalUsers: totalUsersInFirstDayOfPeriod,
      totalMonthlyPremiumUsers: totalMonthlyPremiumUsersInFirstDayOfPeriod,
      totalAnnuallyPremiumUsers: totalAnnuallyPremiumUsersInFirstDayOfPeriod,
      totalNormalUsers: totalNormalUsersInFirstDayOfPeriod,
    };
  }

  private getQueryOptionsByUserType(
    date: Date,
    userType: StatisticUserType,
  ): FindManyOptions<UserEntity> {
    const options: FindManyOptions<UserEntity> = {
      relations: {
        family: true,
      },
      where: {
        createdAt: LessThanOrEqual(endOfDay(date)),
      },
    };

    if (
      [
        StatisticUserType.MONTHLY_PREMIUM,
        StatisticUserType.ANNUALLY_PREMIUM,
      ].includes(userType)
    ) {
      options.where = {
        ...options.where,
        family: { productId: userType },
      };
    }

    if (userType === StatisticUserType.NORMAL) {
      options.where = {
        ...options.where,
        family: { productId: IsNull() },
      };
    }

    return options;
  }
}
