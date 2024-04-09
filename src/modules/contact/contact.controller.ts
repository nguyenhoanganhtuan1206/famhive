import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { ContactService } from './contact.service';
import { ContactDto } from './dtos/contact.dto';
import { CreateContactDto } from './dtos/create-contact.dto';
import { GetContactsDto } from './dtos/get-contacts.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Controller('contacts')
@ApiTags('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ContactDto })
  async create(
    @Body() createDto: CreateContactDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.contactService.createContact(createDto, user);
  }

  @Get()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiCreatedResponse({ type: ContactDto })
  async getContacts(
    @Query() getContactsDto: GetContactsDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.contactService.getContacts(getContactsDto, user);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a specific contact by id' })
  @ApiOkResponse({
    type: ContactDto,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  async findOne(@UUIDParam('id') id: Uuid, @AuthUser() user: UserEntity) {
    const contactEntity = await this.contactService.findOneOrFail(id, user);

    return contactEntity.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiCreatedResponse({ type: ContactDto })
  async updateContacts(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() updateDto: UpdateContactDto,
  ) {
    return this.contactService.updateContact(updateDto, id, user);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a contact by id' })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.CREATED)
  remove(@UUIDParam('id') id: Uuid, @AuthUser() user: UserEntity) {
    return this.contactService.deleteContact(id, user);
  }
}
