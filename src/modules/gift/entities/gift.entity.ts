import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import { UserEntity } from '../../user/user.entity';
import { GiftDto } from '../dto/gift.dto';

@Entity('gifts')
@UseDto(GiftDto)
export class GiftEntity extends AbstractEntity<GiftDto> {
  @Column()
  title: string;

  @Column({ default: 0 })
  star: number;

  @Column()
  familyId: Uuid;

  @Column({ nullable: true })
  createdById: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.todos, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_gift_family' })
  family: FamilyEntity;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_gift_user' })
  createdBy: UserEntity;
}
