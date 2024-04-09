import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import _ from 'lodash';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AwardHistoryType } from '../../../constants/award-history-type';
import type { RedemptionHistoryDto } from '../../reward/dto/redemption-history.dto';
import type { GiftRedemptionHistoryEntity } from '../entities/gift-redemption-history.entity';

export class GiftRedemptionDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  star: number;

  @ApiPropertyOptional({ isArray: true })
  assigneeIds: Uuid[];

  constructor(gift: GiftRedemptionHistoryEntity) {
    super(gift, { excludeFields: true });
    this.title = gift.title;
    this.star = gift.star;
    this.assigneeIds = _.map(gift.assignees, (assignee) => assignee.id);
    this.createdAt = gift.createdAt;
  }

  toRedemptionHistories(): Partial<RedemptionHistoryDto> {
    return {
      amount: this.star,
      description: this.title,
      type: AwardHistoryType.REDEEMED,
      createdAt: this.createdAt,
    };
  }
}
