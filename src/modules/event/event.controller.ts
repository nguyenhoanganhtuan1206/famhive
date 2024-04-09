import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { STRING_TEMPLATE } from '../../constants/sting-template';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { Translate } from '../../decorators/translate.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { GetEventsDto } from './dto/get-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';
import { EventType } from './types/event.type';

@Controller('events')
@ApiTags('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: EventDto })
  async create(
    @Body() createEventDto: CreateEventDto,
    @AuthUser() user: UserEntity,
  ) {
    const createdEvent = await this.eventService.create(user, createEventDto);

    return createdEvent.toDto();
  }

  @Get()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiPageOkResponse({ type: EventDto })
  @Translate('events', 'title', [
    {
      localeKey: '🎂_birthday',
      template: STRING_TEMPLATE.BIRTHDAY,
      where: {
        eventType: EventType.BIRTHDAY,
      },
    },
  ])
  async getEvents(
    @Query() getEventsDto: GetEventsDto,
    @AuthUser() user: UserEntity,
  ): Promise<EventDto[]> {
    const events = await this.eventService.getAllEvents(user, getEventsDto);

    return events.toDtos();
  }

  @Get('suggestion')
  @ApiOperation({ description: 'Suggest event names' })
  @ApiOkResponse({
    type: [String],
  })
  @ApiQuery({
    name: 'textSearch',
    type: String,
    required: false,
    description: `ignore 'textSearch' if you want to get all suggestion names`,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  suggestEventNames(
    @AuthUser() user: UserEntity,
    @Query('textSearch') textSearch?: string,
  ) {
    return this.eventService.suggestNames(user, textSearch);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(Number(id));
  }

  @Put(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updateEvent(
    @UUIDParam('id') id: Uuid,
    @Body() updateEventDto: UpdateEventDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.eventService.updateEvent(user, id, updateEventDto);
  }

  @Delete(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deleteEvent(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
  ): Promise<void> {
    await this.eventService.deleteEvent(user, id);
  }

  @Post('reminder')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async reminder(): Promise<void> {
    await this.eventService.remindUpcommingEvents(new Date());
  }
}
