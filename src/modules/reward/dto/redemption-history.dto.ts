import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AwardHistoryType } from '../../../constants/award-history-type';
import type { RedemptionHistoryEntity } from '../entities/redemption-history.entity';

export class RedemptionHistoryDto extends AbstractDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: AwardHistoryType;

  constructor(redeemedHistory: RedemptionHistoryEntity) {
    super(redeemedHistory, { excludeFields: true });
    this.amount = redeemedHistory.amount;
    this.description = redeemedHistory.description;
    this.type = redeemedHistory.type;
    this.createdAt = redeemedHistory.createdAt;
  }
}
