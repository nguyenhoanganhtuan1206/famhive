import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactEntity } from './entities/contact.entity';

export const handlers = [];

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactController],
  exports: [ContactService],
  providers: [ContactService, ...handlers],
})
export class ContactModule {}
