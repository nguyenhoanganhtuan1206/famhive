import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { endOfDay, startOfDay } from '../../utils/date.utils';
import { UpdateUserCommand } from '../user/commands/update-user.command';
import { UserEntity } from '../user/user.entity';
import { CreateBalanceHistoryRequestDto } from './dto/create-balance-history.dto';
import { BalanceHistoryEntity } from './entities/balance-history.entity';
import { ChoreEntity } from './entities/chore.entity';

@Injectable()
export class BalanceHistoryService {
  constructor(
    @InjectRepository(BalanceHistoryEntity)
    private balanceHistoryRepository: Repository<BalanceHistoryEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  async create(
    createBalanceHistoryDto: CreateBalanceHistoryRequestDto,
    user: UserEntity,
    createForUserId: Uuid,
  ) {
    const isRewardStar = user.family.rewardType === 'star';

    return this.createBalanceHistory({
      userId: createForUserId,
      createdById: user.id,
      title: createBalanceHistoryDto.title,
      amountStar: isRewardStar ? createBalanceHistoryDto.amount : 0,
      amountMoney: isRewardStar ? 0 : createBalanceHistoryDto.amount,
    });
  }

  @Transactional()
  async createBalanceHistoryByChore(chore: ChoreEntity, userId: Uuid) {
    return this.createBalanceHistory({
      userId,
      amountMoney: chore.rewardMoney,
      amountStar: chore.rewardStar,
      title: chore.title,
      choreId: chore.id,
    });
  }

  private async createBalanceHistory(
    balanceHistory: Partial<BalanceHistoryEntity>,
  ) {
    const balance = await this.balanceHistoryRepository.save(
      this.balanceHistoryRepository.create({
        ...balanceHistory,
        date: new Date(),
      }),
    );

    await this.updateUserBalance(
      balance.userId,
      balance.amountMoney,
      balance.amountStar,
    );

    return balance;
  }

  getByUser(userId: Uuid, fromDate: Date, toDate: Date) {
    return this.balanceHistoryRepository.findBy({
      userId,
      date: Between(startOfDay(fromDate), endOfDay(toDate)),
    });
  }

  @Transactional()
  async removeBalanceHistoryByChore(choreId: Uuid, userId: Uuid) {
    const balanceHistoryEntity = await this.findOneOrFailByChoreId(
      choreId,
      userId,
    );
    await this.updateUserBalance(
      userId,
      -balanceHistoryEntity.amountMoney,
      -balanceHistoryEntity.amountStar,
    );
    await this.balanceHistoryRepository.remove(balanceHistoryEntity);
  }

  private updateUserBalance(
    id: Uuid,
    balanceMoney: number,
    balanceStar: number,
  ) {
    return this.commandBus.execute<UpdateUserCommand, void>(
      new UpdateUserCommand(id, { balanceMoney, balanceStar }),
    );
  }

  findOneOrFailByChoreId(choreId: Uuid, userId: Uuid) {
    return this.balanceHistoryRepository.findOneByOrFail({ choreId, userId });
  }
}
