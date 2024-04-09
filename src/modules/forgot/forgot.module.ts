import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';
import { ForgotEntity } from './entities/forgot.entity';
import { ForgotController } from './forgot.controller';
import { ForgotService } from './forgot.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotEntity, UserEntity])],
  controllers: [ForgotController],
  providers: [ForgotService],
})
export class ForgotModule {}
