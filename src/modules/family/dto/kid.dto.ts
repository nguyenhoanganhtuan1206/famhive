import { ApiPropertyOptional } from '@nestjs/swagger';

import { UserDto } from '../../user/dtos/user.dto';
import type { UserEntity } from '../../user/user.entity';

export class KidDto extends UserDto {
  @ApiPropertyOptional()
  order: number;

  constructor(user: UserEntity) {
    super(user);
    this.order = user.order;
  }

  static toKidDto(userEntity: UserEntity) {
    return new KidDto(userEntity);
  }

  static toKidDtos(userEntities: UserEntity[]) {
    return userEntities.map((userEntity) => KidDto.toKidDto(userEntity));
  }
}
