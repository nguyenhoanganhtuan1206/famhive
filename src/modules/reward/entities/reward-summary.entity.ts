import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { MemberRewardDto } from '../dto/member-reward.dto';

@Entity('reward_summaries')
@UseDto(MemberRewardDto)
export class RewardSummaryEntity extends AbstractEntity<MemberRewardDto> {
  @Column({ default: 0 })
  totalReceived: number;

  @Column({ default: 0 })
  totalRedeemed: number;

  @Column({ default: 0 })
  totalDeducted: number;

  @Column()
  userId: Uuid;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_reward_user' })
  user: UserEntity;
}
