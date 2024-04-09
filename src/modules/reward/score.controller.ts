import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { Translate } from '../../decorators/translate.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { RedemptionHistoryDto } from './dto/redemption-history.dto';
import { RewardService } from './reward.service';

@Controller('scores')
@ApiTags('Scores')
export class ScoreController {
  constructor(private rewardService: RewardService) {}

  @Post('/deduct')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Deduct scores' })
  @ApiOkResponse({
    type: CreateRedemptionDto,
  })
  create(@AuthUser() user: UserEntity, @Body() createDto: CreateRedemptionDto) {
    return this.rewardService.createDeduction(user, createDto);
  }

  @Get('by-user/:userId')
  @ApiOperation({
    description: 'Get score histories for a user',
  })
  @ApiOkResponse({
    type: [RedemptionHistoryDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Translate('todos', 'description')
  findScoreHistories(@Param('userId') userId: Uuid) {
    return this.rewardService.getScoreHistoriesByUserId(userId);
  }
}
