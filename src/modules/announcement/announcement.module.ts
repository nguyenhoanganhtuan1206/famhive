import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AnnouncementByLocaleEntity } from './entities/announcement-by-locale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnouncementEntity, AnnouncementByLocaleEntity]),
  ],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
