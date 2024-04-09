import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import type { IUserEntity } from '../../user/user.entity';
import { UserEntity } from '../../user/user.entity';
import { DeviceDto } from '../dto/device.dto';

export interface IDeviceEntity extends IAbstractEntity<DeviceDto> {
  name?: string;

  identifier: string;

  token?: string;

  timezoneOffset: number;

  user: IUserEntity;
}

@Entity({ name: 'devices' })
@UseDto(DeviceDto)
export class DeviceEntity
  extends AbstractEntity<DeviceDto>
  implements IDeviceEntity
{
  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  identifier: string;

  @Column({ nullable: true })
  token?: string;

  @Column({ default: 0 })
  timezoneOffset: number;

  @Column()
  userId: Uuid;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_device_user' })
  user: UserEntity;
}
