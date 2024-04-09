import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { NotificationDto } from './dto/notification.dto';
import { VerifyPurchaseDto } from './dto/verify-purchase.dto';
import {
  VerifyGooglePayReceiptDto,
  VerifyReceiptDto,
} from './dto/verify-receipt.dto';
import { IGoogleCloudNotification } from './interfaces';
import { PurchaseService } from './purchase.service';

@Controller('purchase')
@ApiTags('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('verify')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Verify receipt' })
  async verifyReceipt(
    @AuthUser() user: UserEntity,
    @Body() verifyReceiptDto: VerifyReceiptDto,
  ) {
    return new VerifyPurchaseDto(
      await this.purchaseService.verifyReceipt(user, verifyReceiptDto),
    );
  }

  @Post('apple-store-notification-v2')
  @ApiOperation({
    description: 'Handle App Store Server Notifications V2',
    externalDocs: {
      description: "Apple's official document",
      url: 'https://developer.apple.com/documentation/appstoreservernotifications/app_store_server_notifications_v2',
    },
  })
  @HttpCode(200)
  async handleAppleServerNotificationV2(
    @Body() notificationDto: NotificationDto,
  ) {
    try {
      await this.purchaseService.handleAppleServerNotificationV2(
        notificationDto.signedPayload,
      );
    } catch (error) {
      Logger.error(
        `Failed to handleAppleServerNotificationV2 with error ${error}`,
        error,
      );
      Logger.error(
        `The error has payload ${notificationDto.signedPayload}`,
        error,
      );

      throw error;
    }
  }

  @Post('google-pay/verify')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Verify google pay receipt data' })
  async verifyGooglePayReceipt(
    @AuthUser() user: UserEntity,
    @Body() verifyReceiptDto: VerifyGooglePayReceiptDto,
  ) {
    return new VerifyPurchaseDto(
      await this.purchaseService.verifyGooglePayReceipt(user, verifyReceiptDto),
    );
  }

  @Post('google-cloud-notification')
  @ApiOperation({
    description: 'Handle Google Cloud Notifications',
  })
  @HttpCode(200)
  async handleGoogleCloudNotification(@Body() data: IGoogleCloudNotification) {
    try {
      await this.purchaseService.handleGoogleCloudNotification(data);
    } catch (error) {
      Logger.error('Failed to handleGoogleCloudNotification with payload', {
        signedPayload: data,
      });

      throw error;
    }
  }
}
