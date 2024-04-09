import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import type { UserEntity } from 'modules/user/user.entity';
import { RRule } from 'rrule';
import { Repository } from 'typeorm';

import { ChoreEntity } from './entities/chore.entity';
import { ChoreStatus } from './types/chore-status.enum';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(ChoreEntity)
    private choreRepository: Repository<ChoreEntity>,
  ) {}

  async getByProfiles(user: UserEntity, _fromDate: Date, _toDate: Date) {
    const chores = await this.findOrFailByFamilyId(user.familyId);
    const members = this.getMembersByChores(chores);

    return Promise.all(
      members.map(async (member) => {
        const assignedChores = await this.findOrFailByUserId(member.id);

        return {
          fullName: member.fullName || '',
          chores: assignedChores.map((chore) =>
            this.generateReportByChore(chore),
          ),
        };
      }),
    );
  }

  async getByChores(user: UserEntity, _fromDate: Date, _toDate: Date) {
    const chores = await this.findOrFailByFamilyId(user.familyId);

    return chores.map((chore) => ({
      title: chore.title,
      icon: chore.icon,
      iconColor: chore.iconColor,
      members: chore.assignees.map((assignee) =>
        this.generateReportByMember(assignee),
      ),
    }));
  }

  private getMembersByChores(chores: ChoreEntity[]) {
    const members: UserEntity[] = [];

    for (const chore of chores) {
      members.push(
        ...chore.assignees.filter(
          (assignee) => !members.some((member) => member.id === assignee.id),
        ),
      );
    }

    return members;
  }

  private generateReportByChore(chore: ChoreEntity) {
    return {
      title: chore.title,
      icon: chore.icon,
      iconColor: chore.iconColor,
      status: [
        ChoreStatus.INCOMPLETE,
        ChoreStatus.DUE_TODAY,
        ChoreStatus.COMPLETED,
        ChoreStatus.UPCOMING,
        ChoreStatus.EMPTY,
        ChoreStatus.UPCOMING,
        ChoreStatus.UPCOMING,
      ],
    };
  }

  private generateReportByMember(member: UserEntity) {
    return {
      fullName: member.fullName || '',
      status: [
        ChoreStatus.INCOMPLETE,
        ChoreStatus.DUE_TODAY,
        ChoreStatus.COMPLETED,
        ChoreStatus.UPCOMING,
        ChoreStatus.EMPTY,
        ChoreStatus.UPCOMING,
        ChoreStatus.UPCOMING,
      ],
    };
  }

  private checkStartEndDate(chore: ChoreEntity, fromDate: Date, toDate: Date) {
    if (chore.rrule) {
      return RRule.fromString(chore.rrule).between(fromDate, toDate).length;
    }

    return dayjs().isAfter(fromDate) && dayjs().isBefore(toDate);
  }

  private getMemberChores(chores: ChoreEntity[], userId: Uuid) {
    return chores.map((chore) =>
      chore.assignees.some((assignee) => assignee.id === userId),
    );
  }

  private findOrFailByFamilyId(familyId: Uuid) {
    return this.choreRepository.find({
      where: {
        familyId,
      },
      order: {
        untilDateTime: 'asc',
      },
      relations: {
        assignees: true,
      },
    });
  }

  private findOrFailByUserId(id: Uuid) {
    return this.choreRepository.find({
      where: {
        assignees: { id },
      },
      order: {
        untilDateTime: 'asc',
      },
      relations: {
        assignees: true,
      },
    });
  }
}
