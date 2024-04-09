import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { RoleType } from '../../constants';
import type { UserEntity } from '../user/user.entity';
import { BalanceHistoryService } from './balance-history.service';
import { ChoreService } from './chore.service';
import type { CheckDoneDto } from './dto/check-done.dto';
import type { ChoreEntity } from './entities/chore.entity';
import { ChoreDoneEntity } from './entities/chore-done.entity';

@Injectable()
export class ChoreDoneService {
  constructor(
    @InjectRepository(ChoreDoneEntity)
    private choreDoneRepository: Repository<ChoreDoneEntity>,
    private choreService: ChoreService,
    private balanceHistoryService: BalanceHistoryService,
  ) {}

  async check(user: UserEntity, choreId: Uuid, checkDoneDto: CheckDoneDto) {
    const chore = await this.choreService.findOneOrFail(user.familyId, choreId);
    const { userId, date } = checkDoneDto;

    if (!this.canUpdateChoreStatus(user, chore)) {
      throw new ForbiddenException();
    }

    const currentChoreStatusEntity = await this.findOneBy(
      choreId,
      userId,
      date,
    );

    if (currentChoreStatusEntity) {
      throw new BadRequestException('The chore has already been done.');
    }

    await this.choreDoneRepository.save(
      this.choreDoneRepository.create({
        choreId: chore.id,
        userId,
        date,
      }),
    );

    await this.balanceHistoryService.createBalanceHistoryByChore(chore, userId);
  }

  async uncheck(user: UserEntity, choreId: Uuid, checkDoneDto: CheckDoneDto) {
    const chore = await this.choreService.findOneOrFail(user.familyId, choreId);
    const { userId, date } = checkDoneDto;

    if (!this.canUpdateChoreStatus(user, chore)) {
      throw new ForbiddenException();
    }

    const currentChoreStatusEntity = await this.findOneBy(
      choreId,
      userId,
      date,
    );

    if (!currentChoreStatusEntity) {
      throw new BadRequestException(`The chore still isn't done.`);
    }

    await this.choreDoneRepository.remove(currentChoreStatusEntity);
    await this.balanceHistoryService.removeBalanceHistoryByChore(
      chore.id,
      userId,
    );
  }

  findOneBy(choreId: Uuid, userId: Uuid, date: Date) {
    return this.choreDoneRepository.findOneBy({
      choreId,
      userId,
      date,
    });
  }

  private canUpdateChoreStatus(user: UserEntity, chore: ChoreEntity) {
    return this.isAssigneeOfChore(chore, user) || user.role !== RoleType.KID;
  }

  private isAssigneeOfChore(chore: ChoreEntity, user: UserEntity) {
    return _.some(chore.assignees, (assignee) => assignee.id === user.id);
  }
}
