import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { Translate } from '../../decorators/translate.decorator';
import { UserEntity } from '../../modules/user/user.entity';
import { ChoreService } from './chore.service';
import { ChoreDoneService } from './chore-done.service';
import { CheckDoneDto } from './dto/check-done.dto';
import { ChoreDto } from './dto/chore.dto';
import { CreateChoreDto } from './dto/create-chore.dto';
import { GetHouseholdTodayResponseDto } from './dto/get-household-today-response.dto';
import { UpdateChoreDto } from './dto/update-chore.dto';

@Controller('chores')
@ApiTags('chores')
export class ChoreController {
  constructor(
    private readonly choresService: ChoreService,
    private readonly choreDoneService: ChoreDoneService,
  ) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Create a chore' })
  @ApiOkResponse({
    type: ChoreDto,
  })
  create(@AuthUser() user: UserEntity, @Body() createChoreDto: CreateChoreDto) {
    return this.choresService.create(user, createChoreDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all chores' })
  @ApiOkResponse({
    type: [ChoreDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Translate('chores', 'text')
  findAll(@AuthUser() user: UserEntity) {
    return this.choresService.findAll(user);
  }

  @Get('household-today')
  @ApiOperation({ description: 'Get list household today' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [GetHouseholdTodayResponseDto],
    isArray: true,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  getHouseholdToday(
    @AuthUser() user: UserEntity,
  ): Promise<GetHouseholdTodayResponseDto[]> {
    return this.choresService.getHouseholdToday(user);
  }

  @Get(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOperation({ description: 'Get a chore by id' })
  @ApiOkResponse({
    type: ChoreDto,
  })
  findOne(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    return this.choresService.findOne(user, id);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @Patch(':id')
  @ApiOperation({ description: 'Update a chore by id' })
  @ApiOkResponse({
    type: ChoreDto,
  })
  update(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() updateChoreDto: UpdateChoreDto,
  ) {
    return this.choresService.update(user, id, updateChoreDto);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Post('check/:id')
  @ApiOperation({ description: 'Check a chore' })
  @ApiOkResponse({
    type: ChoreDto,
  })
  check(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() checkDoneDto: CheckDoneDto,
  ) {
    return this.choreDoneService.check(user, id, checkDoneDto);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Delete('check/:id')
  @ApiOperation({ description: 'Uncheck a chore' })
  @ApiOkResponse({
    type: ChoreDto,
  })
  uncheck(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() checkDoneDto: CheckDoneDto,
  ) {
    return this.choreDoneService.uncheck(user, id, checkDoneDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a chore' })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  remove(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    return this.choresService.remove(user, id);
  }
}
