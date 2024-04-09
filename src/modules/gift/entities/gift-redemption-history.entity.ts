import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import { UserEntity } from '../../user/user.entity';
import { GiftRedemptionDto } from '../dto/gift-redemption.dto';

@Entity('gift-redemptions')
@UseDto(GiftRedemptionDto)
export class GiftRedemptionHistoryEntity extends AbstractEntity<GiftRedemptionDto> {
  @Column()
  title: string;

  @Column({ default: 0 })
  star: number;

  @ManyToMany(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  assignees: UserEntity[];

  @Column()
  familyId: Uuid;

  @Column({ nullable: true })
  createdById: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.todos, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_gift_redemption_family' })
  family: FamilyEntity;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_gift_redemption_user' })
  createdBy: UserEntity;
}
