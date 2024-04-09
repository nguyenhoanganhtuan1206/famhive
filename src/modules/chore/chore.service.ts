import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { UserEntity } from '../../modules/user/user.entity';
import { calculateRruleString } from '../../utils/rrule.utils';
import { GetUsersCommand } from '../user/commands/get-users.command';
import { ChoreDto } from './dto/chore.dto';
import type { CreateChoreDto } from './dto/create-chore.dto';
import type { UpdateChoreDto } from './dto/update-chore.dto';
import { ChoreEntity } from './entities/chore.entity';

@Injectable()
export class ChoreService {
  constructor(
    @InjectRepository(ChoreEntity)
    private choreRepository: Repository<ChoreEntity>,
    private readonly commandBus: CommandBus,
  ) {}

  async create(user: UserEntity, createChoreDto: CreateChoreDto) {
    const rewardData = this.getRewardData(
      user.family.rewardType,
      createChoreDto.reward,
    );
    const chore = this.choreRepository.create({
      ...createChoreDto,
      ...rewardData,
      familyId: user.familyId,
    });

    if (chore.isRecurring) {
      chore.rrule = calculateRruleString(
        chore.recurringType,
        chore.dueDate || new Date(),
        chore.untilDateTime,
        chore.byWeekDay,
      );
    }

    await this.choreRepository.save(chore);

    return this.findOne(user, chore.id);
  }

  private getRewardData(rewardType: string, reward: number) {
    return rewardType === 'star'
      ? { rewardStar: reward }
      : { rewardMoney: reward };
  }

  async findAll(user: UserEntity) {
    const chores = await this.choreRepository.find({
      where: {
        familyId: user.familyId,
      },
      order: {
        dueDate: 'asc',
        createdAt: 'asc',
      },
      relations: {
        assignees: true,
      },
    });

    return chores.map((x) => ChoreDto.toChoreDto(x, user.family.rewardType));
  }

  async getHouseholdToday(user: UserEntity) {
    const members = await this.getFamilyMembers(user.familyId);

    return members.map((member) => ({
      id: member.id,
      fullName: member.fullName || '',
      color: member.color || '',
      dueToday: Math.floor(Math.random() * 100),
    }));
  }

  async getUserChoresByDate(userId: Uuid) {
    const userChores = await this.choreRepository.findBy({
      assignees: { id: userId },
    });

    return Promise.all(
      userChores.map((chore) => ({
        id: chore.id,
        title: chore.title,
        reward: chore.rewardStar,
        isDone: false,
      })),
    );
  }

  private getFamilyMembers(familyId: Uuid) {
    return this.commandBus.execute<GetUsersCommand, UserEntity[]>(
      new GetUsersCommand({ where: { familyId } }),
    );
  }

  async remove(user: UserEntity, id: Uuid) {
    const chore = await this.findOneOrFail(user.familyId, id);

    await this.choreRepository.delete(chore.id);
  }

  async update(user: UserEntity, id: Uuid, updateChoreDto: UpdateChoreDto) {
    const chore = await this.findOneOrFail(user.familyId, id);

    const rewardData = this.getRewardData(
      user.family.rewardType,
      updateChoreDto.reward!,
    );

    this.choreRepository.merge(chore, {
      ...updateChoreDto,
      ...rewardData,
    });

    if (chore.isRecurring) {
      chore.rrule = calculateRruleString(
        chore.recurringType,
        chore.dueDate || new Date(),
        chore.untilDateTime,
        chore.byWeekDay,
      );
    }

    await this.choreRepository.save(chore);

    return this.findOne(user, id);
  }

  async findOne(user: UserEntity, id: Uuid) {
    const choreEntity = await this.findOneOrFail(user.familyId, id);

    return ChoreDto.toChoreDto(choreEntity, user.family.rewardType);
  }

  findOneOrFail(familyId: Uuid, id: Uuid) {
    return this.choreRepository.findOneOrFail({
      where: {
        id,
        familyId,
      },
      relations: {
        assignees: true,
      },
    });
  }
}
