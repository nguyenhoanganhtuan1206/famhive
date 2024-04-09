import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ChorePriceHistoryEntity } from '../entities/chore-price-history.entity';

export class ChorePriceHistoryDto extends AbstractDto {
  @ApiPropertyOptional()
  reward: number;

  @ApiProperty()
  choreId: Uuid;

  @ApiProperty()
  date: Date;

  constructor(chore: ChorePriceHistoryEntity) {
    super(chore);
    this.choreId = chore.choreId;
    this.date = chore.date;
  }
}
