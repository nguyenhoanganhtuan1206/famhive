import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { MemberRewardDto } from './dto/member-reward.dto';
import { RewardService } from './reward.service';

@Controller('reward')
@ApiTags('Reward')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get()
  @ApiOperation({
    description: 'Get the total reward details of members',
  })
  @ApiOkResponse({
    type: [MemberRewardDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  findMemberRewards(@AuthUser() user: UserEntity) {
    return this.rewardService.getMemberRewards(user);
  }
}
