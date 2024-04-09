import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserBalanceDto } from '../user/dtos/user-balance.dto';
import { UserEntity } from '../user/user.entity';
import { BalanceHistoryService } from './balance-history.service';
import { BalanceHistoryDto } from './dto/balance-history.dto';
import { CreateBalanceHistoryRequestDto } from './dto/create-balance-history.dto';

@Controller('users')
@ApiTags('users')
export class UserBalanceController {
  constructor(private readonly balanceHistoryService: BalanceHistoryService) {}

  @Get(':id/balances')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user balance histories' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BalanceHistoryDto,
    isArray: true,
  })
  async getByUser(
    @UUIDParam('id') userId: Uuid,
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
    @AuthUser() user: UserEntity,
  ): Promise<BalanceHistoryDto[]> {
    const balanceHistories = await this.balanceHistoryService.getByUser(
      userId,
      fromDate,
      toDate,
    );

    return BalanceHistoryDto.toBalanceHistoryDtos(
      balanceHistories,
      user.family.rewardType,
    );
  }

  @Post(':id/balances')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Create a balance history' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBalanceDto,
  })
  async createBalanceHistory(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') userId: Uuid,
    @Body()
    createBalanceHistoryRequestDto: CreateBalanceHistoryRequestDto,
  ): Promise<BalanceHistoryDto> {
    const balanceHistory = await this.balanceHistoryService.create(
      createBalanceHistoryRequestDto,
      user,
      userId,
    );

    return BalanceHistoryDto.toBalanceHistoryDto(
      balanceHistory,
      user.family.rewardType,
    );
  }
}
