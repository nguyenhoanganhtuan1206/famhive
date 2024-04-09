import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { LangCode, RoleType } from '../../constants';
import { UseDto } from '../../decorators';
import { BalanceHistoryEntity } from '../../modules/chore/entities/balance-history.entity';
import { ChoreDoneEntity } from '../../modules/chore/entities/chore-done.entity';
import { DeviceEntity } from '../device/entities/device.entity';
import { FamilyEntity } from '../family/entities/family.entity';
import { UserDto } from './dtos/user.dto';
import { UserConfigurationEntity } from './user-configuration.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  role: RoleType;

  email?: string;

  password?: string;

  phone?: string;

  avatar?: string;

  fullName?: string;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ nullable: true })
  fullName?: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.SPOUSE })
  role: RoleType;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  familyId: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.members, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_user_family',
  })
  family: FamilyEntity;

  @OneToMany(() => DeviceEntity, (device) => device.user)
  @JoinColumn({ name: 'family_id' })
  devices?: DeviceEntity[];

  @OneToMany(
    () => BalanceHistoryEntity,
    (balanceHistory) => balanceHistory.user,
  )
  balanceHistories: BalanceHistoryEntity[];

  @OneToMany(() => ChoreDoneEntity, (choreDone) => choreDone.user)
  choreDone: ChoreDoneEntity[];

  @OneToOne(
    () => UserConfigurationEntity,
    (useConfiguration) => useConfiguration.user,
  )
  configuration?: UserConfigurationEntity;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: false })
  completedSetup: boolean;

  @Column({ nullable: true, default: false })
  verified?: boolean;

  @Column({ nullable: true, default: true })
  activated?: boolean;

  @Column({ nullable: true })
  verifyCode?: string;

  @Column({ nullable: true })
  verifyCodeCreatedAt?: Date;

  @Column({ nullable: true })
  birthday?: Date;

  @Column({ default: 0 })
  order: number;

  @Column({ default: LangCode.EN })
  langCode: LangCode;

  @Column({ default: 0 })
  balanceStar: number;

  @Column({ default: 0, type: 'decimal' })
  balanceMoney: number;
}
