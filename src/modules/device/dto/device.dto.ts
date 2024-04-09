import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { DeviceEntity } from '../entities/device.entity';

export class DeviceDto extends AbstractDto {
  @ApiProperty()
  identifier: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  token?: string;

  @ApiProperty()
  timezoneOffset: number;

  constructor(device: DeviceEntity) {
    super(device);
    this.identifier = device.identifier;
    this.name = device.name;
    this.token = device.token;
    this.timezoneOffset = device.timezoneOffset;
  }
}
