import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { isPremium } from '../../common/utils';
import { RoleType } from '../../constants';
import {
  ApiTranslateOptions,
  Auth,
  AuthUser,
  UUIDParam,
} from '../../decorators';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { PurchaseInfoDto } from '../purchase/dto/purchase-info.dto';
import { PurchasePageOptionsDto } from '../purchase/dto/purchase-page-options.dto';
import { UserDto } from '../user/dtos/user.dto';
import { UserBalanceDto } from '../user/dtos/user-balance.dto';
import { UserEntity } from '../user/user.entity';
import { ConfigDto } from './dto/config.dto';
import CreateKidDto from './dto/create-kid.dto';
import { FamilyDto } from './dto/family.dto';
import { KidDto } from './dto/kid.dto';
import UpdateKidDto from './dto/update-kid.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateMyConfigurationDto } from './dto/update-my-configuration.dto';
import { UpdateSpouseDto } from './dto/update-spouse.dto';
import UpsertKidDto from './dto/upsert-kid.dto';
import { FamilyService } from './family.service';

@Controller('family')
@ApiTags('family')
export class FamilyController {
  constructor(
    private readonly familyService: FamilyService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Get()
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiOperation({ description: 'Get family status' })
  @ApiOkResponse({
    type: FamilyDto,
  })
  async getMy(@AuthUser() user: UserEntity) {
    const family = await this.familyService.getFamily(user);

    return new FamilyDto(
      family,
      isPremium(family, this.apiConfigService.iap.subscriptionExpiredDelay),
    );
  }

  @Get('balances')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user balances' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBalanceDto,
    isArray: true,
  })
  getFamilyBalance(@AuthUser() user: UserEntity): Promise<UserBalanceDto[]> {
    return this.familyService.getFamilyBalances(user.familyId);
  }

  @Get('/:id/members')
  @ApiOperation({ description: 'Get all members in the family' })
  @ApiOkResponse({
    type: [UserDto],
  })
  @Auth([RoleType.SUPERUSER])
  async getMembersOfSpecificFamily(@UUIDParam('id') familyId: Uuid) {
    const family = await this.familyService.getById(familyId);

    return UserDto.toUserDtos(
      await this.familyService.getMembersByFamilyId(family.id),
    );
  }

  @Get('members')
  @ApiOperation({ description: 'Get all members in the family' })
  @ApiOkResponse({
    type: [UserDto],
  })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  async getMembers(@AuthUser() user: UserEntity) {
    return UserDto.toUserDtos(await this.familyService.getMembers(user));
  }

  @Patch('me')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiOperation({ description: 'Update my information at 1st step' })
  @ApiOkResponse({
    type: UserDto,
  })
  async updateMe(@AuthUser() user: UserEntity, @Body() updateMe: UpdateMeDto) {
    return UserDto.toUserDto(await this.familyService.updateMe(user, updateMe));
  }

  @Patch('config')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOperation({ description: 'Update family config' })
  @ApiOkResponse({
    type: FamilyDto,
  })
  async config(@AuthUser() user: UserEntity, @Body() configDto: ConfigDto) {
    await this.familyService.config(user, configDto);
  }

  @Patch('language')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiTranslateOptions()
  @ApiOperation({ description: 'Update language for user' })
  @ApiOkResponse({
    type: UserDto,
  })
  async updateLanguage(@AuthUser() user: UserEntity) {
    return UserDto.toUserDto(await this.familyService.updateLanguage(user));
  }

  @Patch('my-configuration')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOperation({ description: 'Update my configuration' })
  @ApiOkResponse({
    type: UserDto,
  })
  async updateMyConfiguration(
    @AuthUser() user: UserEntity,
    @Body() updateMyConfiguration: UpdateMyConfigurationDto,
  ) {
    return UserDto.toUserDto(
      await this.familyService.updateMyConfiguration(
        user,
        updateMyConfiguration,
      ),
    );
  }

  @Get('me')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiOperation({ description: 'Get my information at 1st step' })
  @ApiOkResponse({
    type: UserDto,
  })
  getMe(@AuthUser() user: UserEntity) {
    return new UserDto(user);
  }

  @Patch('spouse')
  @ApiOperation({ description: "Update spouse' information" })
  @Auth([RoleType.ADMIN])
  @ApiOkResponse({
    type: UserDto,
  })
  async updateSpouse(
    @AuthUser() user: UserEntity,
    @Body() updateSpouseDto: UpdateSpouseDto,
  ) {
    return UserDto.toUserDto(
      await this.familyService.updateSpouse(user, updateSpouseDto),
    );
  }

  @Get('spouse')
  @Auth([RoleType.ADMIN])
  @ApiOperation({ description: "Get spouse' information" })
  @ApiOkResponse({
    type: UserDto,
  })
  async getSpouse(@AuthUser() user: UserEntity) {
    const spouse = await this.familyService.getSpouse(user);

    return spouse ? UserDto.toUserDto(spouse) : {};
  }

  @Post('kids')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOkResponse({
    type: [KidDto],
  })
  @ApiOperation({ description: 'Add/remove/update all kids at once' })
  @ApiBody({ type: [UpsertKidDto] })
  async batchUpsertKids(
    @AuthUser() user: UserEntity,
    @Body(new ParseArrayPipe({ items: UpsertKidDto, whitelist: true }))
    upsertKidDtos: UpsertKidDto[],
  ) {
    return KidDto.toKidDtos(
      await this.familyService.batchUpdateKids(user, upsertKidDtos),
    );
  }

  @Get('kids')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiOperation({ description: 'Get all kids' })
  @ApiOkResponse({
    type: [KidDto],
  })
  async getKids(@AuthUser() user: UserEntity) {
    return KidDto.toKidDtos(await this.familyService.getKids(user));
  }

  @Post('kids/add')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOperation({ description: 'Add a kid' })
  async createKid(
    @AuthUser() user: UserEntity,
    @Body() createKidDto: CreateKidDto,
  ) {
    return KidDto.toKidDto(
      await this.familyService.createKid(user, createKidDto),
    );
  }

  @Patch('kids/:id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOperation({ description: "Update a kid' information" })
  async updateKid(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() updateKidDto: UpdateKidDto,
  ) {
    return KidDto.toKidDto(
      await this.familyService.updateKid(user, id, updateKidDto),
    );
  }

  @Delete('kids/:id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @ApiOperation({ description: 'Delete a kid' })
  async deleteKid(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    await this.familyService.deleteKid(user, id);
  }

  @Get('/:id/purchases')
  @ApiOperation({ description: 'Get purchase history in the family' })
  @ApiOkResponse({
    type: PageDto<PurchaseInfoDto>,
  })
  @Auth([RoleType.SUPERUSER])
  async getPurchases(
    @UUIDParam('id') familyId: Uuid,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PurchasePageOptionsDto,
  ) {
    const family = await this.familyService.getById(familyId);

    return this.familyService.getFamilyPurchases(family.id, pageOptionsDto);
  }
}
