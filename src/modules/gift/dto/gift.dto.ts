import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { GiftEntity } from '../entities/gift.entity';

export class GiftDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  star: number;

  @ApiProperty()
  createdById: Uuid;

  constructor(gift: GiftEntity) {
    super(gift);
    this.title = gift.title;
    this.star = gift.star;
    this.createdById = gift.createdById;
  }
}
