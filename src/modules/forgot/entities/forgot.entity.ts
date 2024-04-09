import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../user/user.entity';

@Entity('forgot')
export class ForgotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column()
  code: string;

  @Column()
  userId: Uuid;

  @OneToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_forgot_user' })
  user: UserEntity;

  @Column({
    type: 'timestamp',
  })
  createdAt: Date;
}
