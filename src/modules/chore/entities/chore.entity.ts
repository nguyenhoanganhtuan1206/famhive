import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { RecurringType } from '../../../constants/recurring-type';
import { UseDto } from '../../../decorators';
import { WeekDayType } from '../../../modules/event/types/event.type';
import { FamilyEntity } from '../../../modules/family/entities/family.entity';
import { UserEntity } from '../../user/user.entity';
import { ChoreDto } from '../dto/chore.dto';
import { BalanceHistoryEntity } from './balance-history.entity';
import { ChoreDoneEntity } from './chore-done.entity';
import { ChorePriceHistoryEntity } from './chore-price-history.entity';

@Entity('chores')
@UseDto(ChoreDto)
export class ChoreEntity extends AbstractEntity<ChoreDto> {
  @Column()
  icon: string;

  @Column({ default: '' })
  iconColor: string;

  @Column()
  title: string;

  @ManyToMany(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  assignees: UserEntity[];

  @OneToMany(
    () => BalanceHistoryEntity,
    (balanceHistory) => balanceHistory.chore,
  )
  balanceHistories: BalanceHistoryEntity[];

  @OneToMany(
    () => ChorePriceHistoryEntity,
    (balanceHistory) => balanceHistory.chore,
  )
  priceHistories: ChorePriceHistoryEntity[];

  @OneToMany(() => ChoreDoneEntity, (choreDone) => choreDone.chore)
  choreDone: ChoreDoneEntity[];

  @Column()
  familyId: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.chores, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_chore_family' })
  family: FamilyEntity;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column({ default: 0 })
  rewardStar: number;

  @Column({ default: 0, type: 'decimal' })
  rewardMoney: number;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'enum', enum: RecurringType, nullable: true })
  recurringType?: RecurringType;

  @Column({ type: 'timestamp', nullable: true })
  untilDateTime?: Date | undefined;

  @Column({
    type: 'enum',
    enum: WeekDayType,
    array: true,
    nullable: true,
  })
  byWeekDay?: WeekDayType[];

  @Column({ nullable: true })
  rrule?: string;
}
