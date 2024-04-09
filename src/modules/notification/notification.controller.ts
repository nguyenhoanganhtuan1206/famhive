import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from './types/notification-type';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Create a notification' })
  @ApiOkResponse({
    type: NotificationDto,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('pushes')
  @Auth([RoleType.SUPERUSER])
  @ApiOkResponse({
    description: 'Get push notifications',
    type: [NotificationDto],
  })
  getPushNotifications(): Promise<NotificationDto[]> {
    return this.notificationService.getAll(NotificationType.PUSH_NOTIFICATION);
  }

  @Get('emails')
  @Auth([RoleType.SUPERUSER])
  @ApiOkResponse({
    description: 'Get email notifications',
    type: [NotificationDto],
  })
  getEmails(): Promise<NotificationDto[]> {
    return this.notificationService.getAll(NotificationType.EMAIL);
  }

  @Get(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get a notification by id' })
  @ApiOkResponse({
    type: NotificationDto,
  })
  findOne(@UUIDParam('id') id: Uuid) {
    return this.notificationService.findOneById(id, true);
  }

  @Auth([RoleType.SUPERUSER])
  @Patch(':id')
  @ApiOperation({ description: 'Update a notification by id' })
  @ApiOkResponse({
    type: NotificationDto,
  })
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a notification by id' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.notificationService.remove(id);
  }
}
