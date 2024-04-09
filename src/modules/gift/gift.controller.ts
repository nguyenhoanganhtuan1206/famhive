import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftDto } from './dto/gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftService } from './gift.service';

@Controller('gifts')
@ApiTags('gifts')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @Get()
  @ApiOperation({ description: 'Get all gifts' })
  @ApiOkResponse({
    type: [GiftDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  async findAll(@AuthUser() user: UserEntity) {
    const gifts = await this.giftService.findAll(user);

    return gifts.toDtos();
  }

  @Get('recommendation')
  @ApiOperation({ description: 'Get gift recommendation - From data default' })
  @ApiOkResponse({
    type: [String],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  getGiftRecommendation() {
    return this.giftService.getGiftRecommendation();
  }

  @Get('suggestion')
  @ApiOperation({ description: 'Get gift suggestion - From database' })
  @ApiOkResponse({
    type: [String],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  getGiftSuggestion(@AuthUser() user: UserEntity) {
    return this.giftService.getGiftSuggestion(user);
  }

  @Get(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOperation({ description: 'Get a gift by id' })
  @ApiOkResponse({
    type: GiftDto,
  })
  async findOne(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    return new GiftDto(await this.giftService.findOne(user, id));
  }

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Create a gift' })
  @ApiOkResponse({
    type: GiftDto,
  })
  async create(
    @AuthUser() user: UserEntity,
    @Body() createGiftDto: CreateGiftDto,
  ) {
    return new GiftDto(await this.giftService.create(user, createGiftDto));
  }

  @Patch(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Update a gift by id' })
  @ApiOkResponse({
    type: GiftDto,
  })
  async update(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() updateGiftDto: UpdateGiftDto,
  ) {
    return new GiftDto(await this.giftService.update(user, id, updateGiftDto));
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a gift' })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  async remove(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    await this.giftService.remove(user, id);
  }
}
