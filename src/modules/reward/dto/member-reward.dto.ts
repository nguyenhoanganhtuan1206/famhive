import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { RewardSummaryEntity } from '../entities/reward-summary.entity';

export class MemberRewardDto extends AbstractDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  color: string;

  @ApiProperty({ example: 9 })
  totalReceived: number;

  @ApiProperty({ example: 5 })
  totalRedeemed: number;

  @ApiProperty({ example: 2 })
  totalDeducted: number;

  @ApiProperty({ example: 4 })
  remaining: number;

  constructor(rewardSummary: RewardSummaryEntity) {
    super(rewardSummary, { excludeFields: true });
    this.userId = rewardSummary.userId;
    this.totalReceived = rewardSummary.totalReceived;
    this.totalRedeemed = rewardSummary.totalRedeemed;
    this.totalDeducted = rewardSummary.totalDeducted;
    this.remaining =
      this.totalReceived - this.totalRedeemed - this.totalDeducted;
    this.fullName = rewardSummary.user.fullName || '';
    this.color = rewardSummary.user.color || '';
  }
}
