import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { ChartService } from './chart.service';
import { GetChartByChoreResponseDto } from './dto/get-chart-by-chore-response.dto';
import { GetChartByProfileResponseDto } from './dto/get-chart-by-profile-response.dto';

@Controller('chart')
@ApiTags('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('profiles')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get chart data by profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetChartByProfileResponseDto,
    isArray: true,
  })
  getByProfiles(
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
    @AuthUser() user: UserEntity,
  ): Promise<GetChartByProfileResponseDto[]> {
    return this.chartService.getByProfiles(user, fromDate, toDate);
  }

  @Get('chores')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get chart data by chores' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetChartByChoreResponseDto,
    isArray: true,
  })
  getByChores(
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
    @AuthUser() user: UserEntity,
  ): Promise<GetChartByChoreResponseDto[]> {
    return this.chartService.getByChores(user, fromDate, toDate);
  }
}
