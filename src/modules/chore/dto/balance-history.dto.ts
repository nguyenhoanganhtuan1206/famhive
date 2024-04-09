import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UUIDField } from '../../../decorators';
import type { BalanceHistoryEntity } from '../entities/balance-history.entity';

export class BalanceHistoryDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  @UUIDField()
  userId: Uuid;

  @ApiProperty()
  @UUIDField()
  createdById: Uuid;

  constructor(balanceHistory: BalanceHistoryEntity) {
    super(balanceHistory);
    this.title = balanceHistory.title;
    this.date = balanceHistory.date;
    this.userId = balanceHistory.userId;
    this.createdById = balanceHistory.createdById;
  }

  static toBalanceHistoryDto(
    balanceHistoryEntity: BalanceHistoryEntity,
    rewardType: string,
  ) {
    const balanceHistoryDto = new BalanceHistoryDto(balanceHistoryEntity);

    return {
      ...balanceHistoryDto,
      amount:
        rewardType === 'star'
          ? balanceHistoryEntity.amountStar
          : balanceHistoryEntity.amountMoney,
    };
  }

  static toBalanceHistoryDtos(
    balanceHistoryEntities: BalanceHistoryEntity[],
    rewardType: string,
  ) {
    return balanceHistoryEntities.map((balanceHistory) =>
      BalanceHistoryDto.toBalanceHistoryDto(balanceHistory, rewardType),
    );
  }
}
