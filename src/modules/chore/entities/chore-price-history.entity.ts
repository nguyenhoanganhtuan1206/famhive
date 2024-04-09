import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { ChorePriceHistoryDto } from '../dto/chore-price-history.dto';
import { ChoreEntity } from './chore.entity';

@Entity('chore_price_histories')
@UseDto(ChorePriceHistoryDto)
export class ChorePriceHistoryEntity extends AbstractEntity<ChorePriceHistoryDto> {
  @Column()
  choreId: Uuid;

  @ManyToOne(() => ChoreEntity, (chore) => chore.priceHistories, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_price_histories_chore' })
  chore: ChoreEntity;

  @Column()
  date: Date;

  @Column({ default: 0, nullable: true })
  rewardStar: number;

  @Column({ default: 0, type: 'decimal', nullable: true })
  rewardMoney: number;
}
