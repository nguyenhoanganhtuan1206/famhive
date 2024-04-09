import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ChoreDoneEntity } from '../entities/chore-done.entity';

export class ChoreDoneDto extends AbstractDto {
  @ApiProperty()
  userId: Uuid;

  @ApiProperty()
  choreId: Uuid;

  @ApiProperty()
  date: Date;

  constructor(chore: ChoreDoneEntity) {
    super(chore);
    this.userId = chore.userId;
    this.choreId = chore.choreId;
    this.date = chore.date;
  }
}
