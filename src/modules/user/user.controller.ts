import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import type { BoUserDto } from './dtos/bo-user.dto';
import { GetStatisticsDto } from './dtos/get-statistics.dto';
import { UserDto } from './dtos/user.dto';
import { UserStatisticsDto } from './dtos/user-statistics.dto';
import { UserStatisticsNewPerDayDto } from './dtos/user-statistics-new-per-day.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('admin')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  @ApiOperation({ description: 'Get admin full name' })
  admin(@AuthUser() user: UserEntity) {
    return {
      text: user.fullName,
    };
  }

  @Get()
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get users list' })
  @ApiPageOkResponse({
    type: PageDto<BoUserDto>,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<BoUserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get('statistics/new-users-per-day')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user statistics new per day',
    type: UserStatisticsNewPerDayDto,
  })
  getStatisticsNewPerDay(@Query() getStatisticsDto: GetStatisticsDto) {
    return this.userService.getStatisticsNewPerDay(getStatisticsDto);
  }

  @Get('statistics')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get users statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserStatisticsDto,
  })
  getStatistics(
    @Query(new ValidationPipe({ transform: true }))
    getStatisticDto: GetStatisticsDto,
  ): Promise<UserStatisticsDto> {
    return this.userService.getStatistics(getStatisticDto);
  }

  @Get(':id')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }
}
