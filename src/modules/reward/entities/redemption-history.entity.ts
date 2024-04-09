import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { AwardHistoryType } from '../../../constants/award-history-type';
import { UseDto } from '../../../decorators';
import { TodoEntity } from '../../todo/entities/todo.entity';
import { UserEntity } from '../../user/user.entity';
import { RedemptionHistoryDto } from '../dto/redemption-history.dto';

@Entity('redemption_histories')
@UseDto(RedemptionHistoryDto)
export class RedemptionHistoryEntity extends AbstractEntity<RedemptionHistoryDto> {
  @Column()
  userId: Uuid;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_redeemed_history_user' })
  user: UserEntity;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  createdById: Uuid;

  @ManyToOne(() => UserEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_create_by_redeemed_history_user',
  })
  createdBy: UserEntity;

  @Column({
    type: 'enum',
    enum: AwardHistoryType,
    default: AwardHistoryType.REDEEMED,
  })
  type: AwardHistoryType;

  @Column({ nullable: true })
  todoId?: Uuid;

  @ManyToOne(() => TodoEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_history_todo',
  })
  todo: UserEntity;
}
