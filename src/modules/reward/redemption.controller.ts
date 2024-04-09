import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { RedemptionHistoryDto } from './dto/redemption-history.dto';
import { RewardService } from './reward.service';

@Controller('redemptions')
@ApiTags('Redemptions')
export class RedemptionController {
  constructor(private rewardService: RewardService) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Create redemption' })
  @ApiOkResponse({
    type: CreateRedemptionDto,
  })
  create(
    @AuthUser() user: UserEntity,
    @Body() createRedeemDto: CreateRedemptionDto,
  ) {
    return this.rewardService.createRedemption(user, createRedeemDto);
  }

  @Get('by-user/:userId')
  @ApiOperation({
    description: 'Get redemption histories for a user',
  })
  @ApiOkResponse({
    type: [RedemptionHistoryDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  findRedemptionHistories(@Param('userId') userId: Uuid) {
    return this.rewardService.getRedemptionHistoriesByUserId(userId);
  }
}
