import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { GiftRedemptionDto } from './dto/gift-redemption.dto';
import { RedeemGiftDto } from './dto/redeem-gift.dto';
import { GiftRedemptionService } from './gift-redemption.service';

@Controller('gift-redemptions')
@ApiTags('gift redemptions')
export class GiftRedemptionController {
  constructor(private readonly giftRedemptionService: GiftRedemptionService) {}

  @Get()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOperation({ description: 'Get redeem histories' })
  @ApiOkResponse({
    type: [GiftRedemptionDto],
  })
  async getRedeemHistories(@AuthUser() user: UserEntity) {
    const histories = await this.giftRedemptionService.findRedeemHistories(
      user,
    );

    return histories.toDtos();
  }

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Redeem a gift' })
  @ApiOkResponse({
    type: GiftRedemptionDto,
  })
  async redeemGift(
    @AuthUser() user: UserEntity,
    @Body() redeemGiftDto: RedeemGiftDto,
  ) {
    const giftDone = await this.giftRedemptionService.redeemGift(
      user,
      redeemGiftDto,
    );

    return new GiftRedemptionDto(giftDone);
  }
}
