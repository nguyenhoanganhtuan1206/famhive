import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { UserEntity } from '../user.entity';
import { UserDto } from './user.dto';

export class BoUserDto extends UserDto {
  @ApiPropertyOptional()
  activated?: boolean;

  @ApiPropertyOptional()
  product?: string;

  @ApiProperty()
  familyId: string;

  constructor(user: UserEntity) {
    super(user);
    this.activated = user.activated;
    this.product = user.family.productId;
    this.familyId = user.familyId;
  }

  static toUserDto(userEntity: UserEntity) {
    return new BoUserDto(userEntity);
  }

  static toUserDtos(userEntities: UserEntity[]) {
    return userEntities.map((userEntity) => BoUserDto.toUserDto(userEntity));
  }
}
