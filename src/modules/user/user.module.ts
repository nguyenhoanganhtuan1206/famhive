import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { CreateUserConfigurationHandler } from './commands/create-configuration.command';
import { CreateUserHandler } from './commands/create-user.command';
import { FindUserConfigurationHandler } from './commands/find-configuration.command';
import { FindUsersByHandler } from './commands/find-user-by.command';
import { GetAdminsActivatedByListFamilyIdsHandler } from './commands/get-admins-activated-by-list-family-ids.command';
import { GetUsersHandler } from './commands/get-users.command';
import { UpdateUserConfigurationHandler } from './commands/update-configuration.command';
import { UpdateUserHandler } from './commands/update-user.command';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserConfigurationEntity } from './user-configuration.entity';

export const handlers = [
  CreateUserHandler,
  UpdateUserHandler,
  GetAdminsActivatedByListFamilyIdsHandler,
  FindUsersByHandler,
  GetUsersHandler,
  CreateUserConfigurationHandler,
  FindUserConfigurationHandler,
  UpdateUserConfigurationHandler,
];

@Module({
  imports: [
    FamilyModule,
    TypeOrmModule.forFeature([UserEntity, UserConfigurationEntity]),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserSubscriber, ...handlers],
})
export class UserModule {}
