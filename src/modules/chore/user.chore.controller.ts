import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { ChoreService } from './chore.service';
import { GetUserChoresByDateResponseDto } from './dto/get-user-chores-by-date-response.dto';

@Controller('users')
@ApiTags('users')
export class UserChoreController {
  constructor(private readonly choreService: ChoreService) {}

  @Get(':id/chores-by-date')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get user chores by date' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserChoresByDateResponseDto,
    isArray: true,
  })
  async getUserChoresByDate(
    @UUIDParam('id') userId: Uuid,
    @Query('date') _date: Date,
  ): Promise<GetUserChoresByDateResponseDto[]> {
    return this.choreService.getUserChoresByDate(userId);
  }
}
