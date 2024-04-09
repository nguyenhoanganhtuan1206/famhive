import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { ChoreDoneDto } from '../dto/chore-done.dto';
import { ChoreEntity } from './chore.entity';

@Entity('chore_done')
@UseDto(ChoreDoneDto)
export class ChoreDoneEntity extends AbstractEntity<ChoreDoneDto> {
  @Column()
  userId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.choreDone, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_chore_done_user' })
  user: UserEntity;

  @Column()
  choreId: Uuid;

  @ManyToOne(() => ChoreEntity, (chore) => chore.choreDone, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_chore_done_chore' })
  chore: ChoreEntity;

  @Column()
  date: Date;
}
