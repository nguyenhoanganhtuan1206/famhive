import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type {
  DecodedNotificationPayload,
  Environment,
  NotificationData,
} from 'app-store-server-api';
import {
  AppStoreServerAPI,
  AutoRenewStatus,
  decodeNotificationPayload,
  decodeRenewalInfo,
  decodeTransaction,
  NotificationType,
} from 'app-store-server-api';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { INotificationCallbackInfo } from './notification-callback-info';
import type { IPurchaseInfo } from './purchase-info';

@Injectable()
export class AppstoreClient {
  private appStoreServerAPI: AppStoreServerAPI;

  constructor(private apiConfig: ApiConfigService) {
    const itunesConfig = apiConfig.apple.itunes;
    this.appStoreServerAPI = new AppStoreServerAPI(
      itunesConfig.privateKey,
      itunesConfig.keyId,
      itunesConfig.keyIssuer,
      apiConfig.apple.clientId,
      itunesConfig.environment as Environment,
    );
  }

  async decode(signedPayload: string): Promise<INotificationCallbackInfo> {
    const payload = await decodeNotificationPayload(signedPayload);
    this.validateDecodedNotificationPayload(payload.data);

    return {
      isSuccess: this.isSuccess(payload.notificationType),
      purchase: await this.extractPurchaseInfo(payload),
    };
  }

  private isSuccess(notificationType: NotificationType) {
    Logger.log(`NotificationType IOS: ${notificationType}`);

    const successNotificationTypes = [
      NotificationType.DidRenew,
      NotificationType.DidChangeRenewalStatus,
      NotificationType.Subscribed,
      NotificationType.RenewalExtended,
      NotificationType.ConsumptionRequest,
      NotificationType.DidChangeRenewalPref,
      NotificationType.PriceIncrease,
    ];

    return successNotificationTypes.includes(notificationType);
  }

  private async extractPurchaseInfo(
    payload: DecodedNotificationPayload,
  ): Promise<IPurchaseInfo> {
    const signedTransactionInfo = await decodeTransaction(
      payload.data.signedTransactionInfo,
    );

    const signedRenewalInfo = await decodeRenewalInfo(
      payload.data.signedRenewalInfo,
    );

    return {
      transactionId: signedTransactionInfo.transactionId,
      originalTransactionId: signedRenewalInfo.originalTransactionId,
      productId: signedRenewalInfo.productId,
      autoRenewProductId: signedRenewalInfo.autoRenewProductId,
      autoRenewStatus: signedRenewalInfo.autoRenewStatus === AutoRenewStatus.On,
      purchaseDate: new Date(signedTransactionInfo.purchaseDate),
      originalPurchaseDate: new Date(
        signedTransactionInfo.originalPurchaseDate,
      ),
      expiresDate:
        signedTransactionInfo.expiresDate == null
          ? undefined
          : new Date(signedTransactionInfo.expiresDate),
    };
  }

  private validateDecodedNotificationPayload(
    notificationData: NotificationData,
  ) {
    if (notificationData.bundleId !== this.apiConfig.apple.clientId) {
      throw new BadRequestException(
        `Wrong client id ${notificationData.bundleId} instead of ${this.apiConfig.apple.clientId}`,
      );
    }

    if (
      notificationData.environment !== this.apiConfig.apple.itunes.environment
    ) {
      throw new BadRequestException(
        `Wrong environment ${notificationData.environment} instead of ${this.apiConfig.apple.itunes.environment}`,
      );
    }
  }
}
