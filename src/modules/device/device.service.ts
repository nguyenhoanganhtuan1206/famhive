import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationsService } from '../../shared/services/notification.service';
import type { UserEntity } from '../user/user.entity';
import type { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceEntity } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    private notificationService: NotificationsService,
  ) {}

  async create(
    user: UserEntity,
    createDto: CreateDeviceDto,
  ): Promise<DeviceEntity> {
    const deviceEntity = await this.deviceRepository
      .createQueryBuilder('device')
      .where({
        identifier: createDto.identifier,
      })
      .orWhere({
        token: createDto.token,
      })
      .getOne();

    if (deviceEntity) {
      this.deviceRepository.merge(deviceEntity, createDto);
      deviceEntity.user = user;

      return this.deviceRepository.save(deviceEntity);
    }

    return this.deviceRepository.save(
      this.deviceRepository.create({
        identifier: createDto.identifier,
        token: createDto.token,
        name: createDto.name,
        timezoneOffset: createDto.timezoneOffset,
        user,
      }),
    );
  }

  // get all devices of user, params is user entity
  async list(user: UserEntity): Promise<DeviceEntity[]> {
    return this.deviceRepository.find({
      where: {
        userId: user.id,
      },
    });
  }

  async delete(userId: Uuid, identifier: string): Promise<void> {
    const device = await this.deviceRepository.findOneBy({
      identifier,
      userId,
    });

    if (device) {
      await this.deviceRepository.remove(device);
    }
  }

  async sendSelfMessages(user: UserEntity) {
    // get all devices of user and map tokens to an array
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .where({ user_id: user.id })
      .andWhere('token IS NOT NULL');

    const devices = await queryBuilder.getMany();

    const messages = devices.map((device) => ({
      token: device.token!,
      title: 'Fam App',
      message: 'You have a new message',
    }));

    // send messages to all devices
    return this.notificationService.sendFirebaseMessages(messages);
  }
}
