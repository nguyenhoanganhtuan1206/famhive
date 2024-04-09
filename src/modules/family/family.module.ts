import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { CreateFamilyCommandHandler } from './commands/create-family.command';
import { DeleteFamilyCommandHandler } from './commands/delete-family.command';
import { FindFamilyCommandHandler } from './commands/find-family.command';
import { UpdateFamilyCommandHandler } from './commands/update-family.command';
import { FamilyEntity } from './entities/family.entity';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyEntity, UserEntity])],
  controllers: [FamilyController],
  providers: [
    FamilyService,
    CreateFamilyCommandHandler,
    UpdateFamilyCommandHandler,
    FindFamilyCommandHandler,
    DeleteFamilyCommandHandler,
  ],
  exports: [FamilyService],
})
export class FamilyModule {}
