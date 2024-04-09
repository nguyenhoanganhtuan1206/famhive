import { CommandBus } from '@nestjs/cqrs';
import _ from 'lodash';
import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { DataSource, EventSubscriber } from 'typeorm';

import { generateHash } from '../../../common/utils';
import { CreateUpdateDobEventCommand } from '../../event/commands/create-update-dob-event.command';
import { UserEntity } from '../user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private dataSource: DataSource, private commandBus: CommandBus) {
    dataSource.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<UserEntity>): Promise<void> {
    const user = event.entity;

    if (user.birthday) {
      await this.commandBus.execute(
        new CreateUpdateDobEventCommand(event.entity),
      );
    }
  }

  async afterUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    const userInfo = event.databaseEntity;
    const newUserInfo = event.entity;

    if (
      newUserInfo &&
      (userInfo.birthday !== newUserInfo.birthday ||
        userInfo.fullName !== newUserInfo.fullName)
    ) {
      userInfo.birthday = newUserInfo.birthday;
      userInfo.fullName = newUserInfo.fullName;
      await this.commandBus.execute(new CreateUpdateDobEventCommand(userInfo));
    }
  }

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    const entity = event.entity;

    if (entity.password) {
      entity.password = generateHash(entity.password);
    }

    this.updateCompletedSetup(entity);
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    // FIXME check event.databaseEntity.password
    const entity = event.entity as UserEntity;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = generateHash(entity.password!);
    }

    this.updateCompletedSetup(entity);
  }

  private updateCompletedSetup(entity: UserEntity) {
    entity.completedSetup =
      entity.completedSetup ||
      (!_.isEmpty(entity.fullName) && !_.isEmpty(entity.color));
  }
}
