import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import _ from 'lodash';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { AnnouncementService } from './announcement.service';
import { ScreenName } from './constants/screen-name';
import { AnnouncementDto } from './dto/announcement.dto';
import { AnnouncementsQuery } from './dto/announcements.query';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
@ApiTags('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get announcements' })
  @ApiOkResponse({
    type: [AnnouncementDto],
  })
  findAll(
    @Query()
    announcementsQuery: AnnouncementsQuery,
  ) {
    return this.announcementService.findAll(announcementsQuery);
  }

  @Get('screen-list')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get screen list' })
  @ApiOkResponse({
    type: [String],
  })
  getScreenList() {
    return _.values(ScreenName);
  }

  @Get('current')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get current announcements' })
  @ApiOkResponse({
    type: [AnnouncementDto],
  })
  getCurrentAnnouncements(@AuthUser() user: UserEntity) {
    return this.announcementService.getCurrentAnnouncements(user);
  }

  @Get(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get announcement by Id' })
  @ApiOkResponse({
    type: [AnnouncementDto],
  })
  find(@UUIDParam('id') id: Uuid) {
    return this.announcementService.findOne(id);
  }

  @Post()
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create a announcement' })
  @ApiOkResponse({
    type: AnnouncementDto,
  })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Patch(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create a announcement' })
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    await this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a announcement' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.announcementService.remove(id);
  }
}
