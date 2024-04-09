import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './user.entity';

@Entity({ name: 'user-configurations' })
@UseDto(UserDto)
export class UserConfigurationEntity extends AbstractEntity<UserDto> {
  @Column({ default: true })
  isShowTodoDone: boolean;

  @Column({ default: true })
  isShowTaskDone: boolean;

  @Column()
  userId: Uuid;

  @OneToOne(() => UserEntity, (user) => user.configuration, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_configuration_user' })
  user: UserEntity;
}
