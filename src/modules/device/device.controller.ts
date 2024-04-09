import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDto } from './dto/device.dto';

@Controller('devices')
@ApiTags('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: DeviceDto })
  async create(
    @Body() createDto: CreateDeviceDto,
    @AuthUser() user: UserEntity,
  ) {
    const device = await this.deviceService.create(user, createDto);

    return device.toDto();
  }

  @Post('send-message')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  async sendMessage(@AuthUser() user: UserEntity) {
    await this.deviceService.sendSelfMessages(user);
  }

  @Get()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiCreatedResponse({ type: DeviceDto })
  async list(@AuthUser() user: UserEntity) {
    const devices = await this.deviceService.list(user);

    return devices.toDtos();
  }
}
