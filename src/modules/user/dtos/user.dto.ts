import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { LangCode, RoleType } from '../../../constants';
import type { UserEntity } from '../user.entity';
import { UserConfigurationDto } from './user-configuration.dto';

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  username: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  activated?: boolean;

  @ApiPropertyOptional()
  verified?: boolean;

  @ApiPropertyOptional()
  birthday?: Date;

  @ApiProperty()
  completedSetup: boolean;

  @ApiProperty()
  configuration?: UserConfigurationDto;

  @ApiProperty()
  langCode?: LangCode;

  constructor(user: UserEntity) {
    super(user);
    this.fullName = user.fullName;
    this.role = user.role;
    this.color = user.color;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.activated = user.activated;
    this.verified = user.verified;
    this.completedSetup = user.completedSetup;
    this.birthday = user.birthday;
    this.configuration = user.configuration;
    this.langCode = user.langCode;
  }

  static toUserDto(userEntity: UserEntity) {
    return new UserDto(userEntity);
  }

  static toUserDtos(userEntities: UserEntity[]) {
    return userEntities.map((userEntity) => UserDto.toUserDto(userEntity));
  }
}
