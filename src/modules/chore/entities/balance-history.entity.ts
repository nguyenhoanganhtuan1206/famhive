import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { BalanceHistoryDto } from '../dto/balance-history.dto';
import { ChoreEntity } from './chore.entity';

@Entity('balance_histories')
@UseDto(BalanceHistoryDto)
export class BalanceHistoryEntity extends AbstractEntity<BalanceHistoryDto> {
  @Column()
  title: string;

  @Column({ default: 0 })
  amountStar: number;

  @Column({ default: 0, type: 'decimal' })
  amountMoney: number;

  @Column()
  date: Date;

  @Column()
  userId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.balanceHistories, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_reward_histories_user' })
  user: UserEntity;

  @Column({ nullable: true })
  createdById: Uuid;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_create_by_reward_histories_user',
  })
  createdBy: UserEntity;

  @Column({ nullable: true })
  choreId: Uuid;

  @ManyToOne(() => ChoreEntity, (chore) => chore.balanceHistories, {
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_reward_histories_chore' })
  chore: ChoreEntity;
}
