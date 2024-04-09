/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { google } from 'googleapis';
import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Transactional } from 'typeorm-transactional';

import { toDate } from '../../common/utils';
import { PaymentPlatform } from '../../constants/payment-platform';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { FindFamilyCommand } from '../family/commands/find-family.command';
import { UpdateFamilyCommand } from '../family/commands/update-family.command';
import type { FamilyEntity } from '../family/entities/family.entity';
import { UserEntity } from '../user/user.entity';
import { AppstoreClient } from './appstore.client';
import { FindFamilyInPurchaseCommand } from './commands/find-family.command';
import { FindLatestFamilyPurchaseCommand } from './commands/find-latest-family-purchase.command';
import {
  VerifyGooglePayReceiptDto,
  VerifyReceiptDto,
} from './dto/verify-receipt.dto';
import { PurchaseEntity } from './entities/purchase.entity';
import {
  GooglePaySubscriptionNotificationType,
  PaymentState,
  PurchaseType,
} from './enum';
import { IGoogleCloudNotification } from './interfaces';
import type { IGooglePurchaseInfo, IPurchaseInfo } from './purchase-info';

@Injectable()
export class PurchaseService {
  private androidPublisher;

  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
    private commandBus: CommandBus,
    private apiConfig: ApiConfigService,
    private appstoreClient: AppstoreClient,
  ) {
    const googlePayConfig = this.apiConfig.googlePay;
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googlePayConfig.clientEmail,
        private_key: googlePayConfig.privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });

    this.androidPublisher = google.androidpublisher({
      version: 'v3',
      auth,
    });
  }

  @Transactional()
  async verifyReceipt(
    userEntity: UserEntity,
    verifyReceiptDto: VerifyReceiptDto,
  ): Promise<FamilyEntity> {
    const response = await this.getVerifyReceipt(verifyReceiptDto.receiptData);

    Logger.log('To validateVerifyReceiptResponse');
    this.validateVerifyReceiptResponse(response);

    Logger.log('To findFamilyOrThrow');
    const family = await this.findFamilyOrThrow({
      id: userEntity.familyId,
    });

    Logger.log('To extractPurchaseInfo');
    const purchaseInfo = this.extractPurchaseInfo(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      response.data.latest_receipt_info[0],
    );
    Logger.log(JSON.stringify(purchaseInfo));
    Logger.log('To updateFamily');

    return this.updateFamily({
      ...family,
      ...purchaseInfo,
    });
  }

  private async getVerifyReceipt(receiptData: string) {
    Logger.log('To getVerifyReceipt');

    try {
      return axios.post(
        this.apiConfig.apple.itunes.verifyReceiptUrl,
        this.buildVerifyReceiptRequestBody(receiptData),
      );
    } catch (error) {
      Logger.error('Error during getVerifyReceipt ' + receiptData);
      Logger.error(error);

      throw error;
    } finally {
      Logger.log('To getVerifyReceipt FINALLY');
    }
  }

  private extractPurchaseInfo(
    latestReceiptInfo: Record<string, string>,
  ): IPurchaseInfo {
    return {
      transactionId: latestReceiptInfo.transaction_id,
      originalTransactionId: latestReceiptInfo.original_transaction_id,
      productId: latestReceiptInfo.product_id,
      purchaseDate: toDate(latestReceiptInfo.purchase_date_ms),
      originalPurchaseDate: toDate(latestReceiptInfo.original_purchase_date_ms),
      expiresDate: toDate(latestReceiptInfo.expires_date_ms),
    };
  }

  private validateVerifyReceiptResponse(response: AxiosResponse) {
    const { data, status } = response;

    if (status !== 200) {
      throw new BadRequestException(
        data,
        'Failed to perform the receipt validation',
      );
    }

    if (data.status > 0) {
      throw new BadRequestException(
        data,
        `Receipt validation with failed status ${data.status}`,
      );
    }

    if (data.environment !== this.apiConfig.apple.itunes.environment) {
      throw new BadRequestException(
        data,
        `Wrong environment to ${data.environment} instead of ${this.apiConfig.apple.itunes.environment}`,
      );
    }
  }

  @Transactional()
  async handleAppleServerNotificationV2(signedPayload: string) {
    const notification = await this.appstoreClient.decode(signedPayload);
    const originalTransactionId = notification.purchase.originalTransactionId;

    const family = await this.findFamilyOrThrow({
      originalTransactionId,
    });

    Logger.log('[handleAppleServerNotificationV2] notification');
    Logger.log(JSON.stringify(notification));

    const { purchase, isSuccess } = notification;

    await this.storePurchase(family, purchase);

    await (isSuccess
      ? this.updatePremium(family, purchase)
      : this.removePremium(family));
  }

  async updateGooglePurchase(purchase: PurchaseEntity, paymentStatus: boolean) {
    const paymentState = paymentStatus
      ? PaymentState.PURCHASED
      : PaymentState.FAILED;

    await this.purchaseRepository.save({
      ...purchase,
      paymentState,
    });
  }

  async updateGooglePremium(
    family: FamilyEntity,
    purchaseInfo: PurchaseEntity,
  ) {
    const purchase = {
      transactionId: purchaseInfo.transactionId,
      originalTransactionId: purchaseInfo.originalTransactionId,
      productId: purchaseInfo.productId,
      purchaseDate: purchaseInfo.purchaseDate,
      originalPurchaseDate: purchaseInfo.originalPurchaseDate,
      expiresDate: purchaseInfo.expiresDate,
      autoRenewProductId: purchaseInfo.autoRenewProductId,
      autoRenewStatus: purchaseInfo.autoRenewStatus,
    };

    await this.updateFamily({
      ...family,
      ...purchase,
    });
  }

  async findPurchaseByToken(purchaseToken: string) {
    return this.purchaseRepository.findOneBy({
      purchaseToken,
    });
  }

  private extractGPAPurchaseInfo(
    receiptData: VerifyGooglePayReceiptDto,
    verifiedReceiptInfo: Record<string, string>,
  ): IPurchaseInfo {
    return {
      transactionId: verifiedReceiptInfo.orderId,
      originalTransactionId: verifiedReceiptInfo.orderId,
      productId: receiptData.productId,
      purchaseDate: toDate(`${receiptData.purchaseTime}`),
      originalPurchaseDate: toDate(`${receiptData.purchaseTime}`),
      expiresDate: toDate(verifiedReceiptInfo.expiryTimeMillis),
      autoRenewProductId: receiptData.productId,
      autoRenewStatus: Boolean(verifiedReceiptInfo.autoRenewing),
    };
  }

  private validateVerifyGoogleReceiptResponse(response) {
    if (response.status !== 200) {
      Logger.error('[Validate payment android failed]', response);

      throw new BadRequestException(
        response,
        'Failed to perform the google pay receipt validation',
      );
    }

    if (!response.data) {
      Logger.error(
        '[Validate payment android failed with no subscription information]',
      );

      throw new BadRequestException(
        'Failed to perform the google pay receipt with no subscription information',
      );
    }
  }

  private async validateFamilyGPAPurchase(family: FamilyEntity): Promise<void> {
    const currentPurchase = await this.commandBus.execute<
      FindLatestFamilyPurchaseCommand,
      PurchaseEntity | null
    >(new FindLatestFamilyPurchaseCommand(family.id));

    if (
      currentPurchase &&
      currentPurchase.paymentPlatform === PaymentPlatform.APPLE_PAY
    ) {
      throw new BadRequestException('You already purchase from Apple');
    }
  }

  @Transactional()
  async verifyGooglePayReceipt(
    userEntity: UserEntity,
    receiptData: VerifyGooglePayReceiptDto,
  ): Promise<FamilyEntity> {
    Logger.log('[verifyGooglePayReceipt] receiptData');
    Logger.log(JSON.stringify(receiptData));

    try {
      const { packageName, productId, purchaseToken } = receiptData;
      const response = await this.androidPublisher.purchases.subscriptions.get({
        packageName,
        subscriptionId: productId,
        token: purchaseToken,
      });

      Logger.log('[verifyGooglePayReceipt] response:');
      Logger.log(JSON.stringify(response));
      this.validateVerifyGoogleReceiptResponse(response);

      // Acknowledges a subscription purchase
      await this.acknowledgeSubscriptionPurchase(
        packageName,
        productId,
        purchaseToken,
      );

      const family = await this.findFamilyOrThrow({
        id: userEntity.familyId,
      });

      // If family already has payment by Apple platform => don't allow continue with Google
      await this.validateFamilyGPAPurchase(family);

      const verifiedReceiptData: Record<string, string> = response.data;
      Logger.log('[verifyGooglePayReceipt] verifiedReceiptData:');
      Logger.log(JSON.stringify(verifiedReceiptData));

      const purchaseInfo = this.extractGPAPurchaseInfo(
        receiptData,
        verifiedReceiptData,
      );

      Logger.log('[verifyGooglePayReceipt] purchaseInfo:');
      Logger.log(JSON.stringify(purchaseInfo));

      // Add purchase history
      await this.storeGooglePurchase(
        family,
        purchaseInfo,
        verifiedReceiptData,
        purchaseToken,
      );

      return this.updateFamily({
        ...family,
        ...purchaseInfo,
      });
    } catch (error) {
      Logger.error(`'Error verifying google pay receipt: ${error}`);

      throw new BadRequestException(
        error?.message ||
          'Sorry, something went wrong when verifying your purchase',
      );
    }
  }

  @Transactional()
  async handleGoogleCloudNotification(payload: IGoogleCloudNotification) {
    const token = payload.message?.data || '';
    const decodedToken = jwt_decode(token, { header: true });
    Logger.log('[handleGoogleCloudNotification] decodedToken');
    Logger.log(JSON.stringify(decodedToken));

    const packageName = _.get(decodedToken, 'packageName', '');
    const notificationType = _.get(
      decodedToken,
      'subscriptionNotification.notificationType',
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_EXPIRED,
    );
    const purchaseToken = _.get(
      decodedToken,
      'subscriptionNotification.purchaseToken',
      '',
    );
    const subscriptionId = _.get(
      decodedToken,
      'subscriptionNotification.subscriptionId',
      '',
    );

    if (!packageName || !purchaseToken || !subscriptionId) {
      Logger.error(
        `'[HandleGoogleCloudNotification]: Do not have any decoded information`,
      );
    }

    // STEP 1: Get subscription information
    // STEP 2: check notificationType => update purchased, renew, canceled
    const response = await this.androidPublisher.purchases.subscriptions.get({
      packageName,
      subscriptionId,
      token: purchaseToken,
    });

    Logger.log('[handleGoogleCloudNotification] response');
    Logger.log(JSON.stringify(response));
    Logger.log(
      `[handleGoogleCloudNotification] notificationType: ${notificationType}`,
    );

    if (response.status !== 200) {
      Logger.error(
        `'[HandleGoogleCloudNotification]: Can not get subscription purchase information`,
      );

      return null;
    }

    const verifiedReceiptData: Record<string, string> = response.data;
    Logger.log('[handleGoogleCloudNotification] verifiedReceiptData');
    Logger.log(JSON.stringify(verifiedReceiptData));

    await this.handleGoogleCloudNotificationByType(
      notificationType,
      purchaseToken,
      verifiedReceiptData,
      subscriptionId,
    );

    // Acknowledges a subscription purchase
    await this.acknowledgeSubscriptionPurchase(
      packageName,
      subscriptionId,
      purchaseToken,
    );
  }

  async handleGoogleCloudNotificationByType(
    notificationType: GooglePaySubscriptionNotificationType,
    purchaseToken: string,
    verifiedReceiptData: Record<string, string>,
    subscriptionId: string,
  ) {
    const purchaseInfo = await this.commandBus.execute<
      FindFamilyInPurchaseCommand,
      PurchaseEntity | null
    >(new FindFamilyInPurchaseCommand({ purchaseToken }));
    Logger.log('[handleGoogleCloudNotificationByType] purchaseInfo');
    Logger.log(JSON.stringify(purchaseInfo));

    if (purchaseInfo) {
      purchaseInfo.autoRenewStatus = Boolean(verifiedReceiptData.autoRenewing);
      purchaseInfo.priceCurrencyCode = verifiedReceiptData.priceCurrencyCode;
      purchaseInfo.priceAmountMicros = verifiedReceiptData.priceAmountMicros;
      purchaseInfo.countryCode = verifiedReceiptData.countryCode;
      purchaseInfo.paymentState = Number(verifiedReceiptData.paymentState);
      purchaseInfo.purchaseType = Number(
        verifiedReceiptData?.purchaseType || PurchaseType.PROMO,
      );
      purchaseInfo.expiresDate = toDate(verifiedReceiptData.expiryTimeMillis);
      purchaseInfo.productId = subscriptionId;

      const isSuccess =
        this.isGooglePaySubscriptionNotificationSuccess(notificationType);

      Logger.log(
        `[handleGoogleCloudNotificationByType] isSuccess: ${isSuccess}`,
      );
      Logger.log('[handleGoogleCloudNotificationByType] purchaseInfo');
      Logger.log(JSON.stringify(purchaseInfo));

      await this.updateGooglePurchase(purchaseInfo, isSuccess);

      await (isSuccess
        ? this.updateGooglePremium(purchaseInfo.family, purchaseInfo)
        : this.removePremium(purchaseInfo.family));
    }
  }

  async acknowledgeSubscriptionPurchase(
    packageName: string,
    subscriptionId: string,
    purchaseToken: string,
  ) {
    try {
      // Acknowledges a subscription purchase
      await this.androidPublisher.purchases.subscriptions.acknowledge({
        packageName,
        subscriptionId,
        token: purchaseToken,
      });
    } catch (error) {
      Logger.error(`'Error Acknowledge Subscription Purchase: ${error}`);
    }
  }

  private async storeGooglePurchase(
    family: FamilyEntity,
    purchaseInfo: IPurchaseInfo,
    verifiedReceiptData: Record<string, string>,
    purchaseToken: string,
  ) {
    const purchaseData: IGooglePurchaseInfo = {
      ...purchaseInfo,
      autoRenewStatus: Boolean(verifiedReceiptData.autoRenewing),
      priceCurrencyCode: verifiedReceiptData.priceCurrencyCode,
      priceAmountMicros: verifiedReceiptData.priceAmountMicros,
      countryCode: verifiedReceiptData.countryCode,
      paymentState: Number(verifiedReceiptData.paymentState),
      purchaseType: Number(
        verifiedReceiptData?.purchaseType || PurchaseType.PROMO,
      ),
      paymentPlatform: PaymentPlatform.GOOGLE_PAY,
      purchaseToken,
    };

    await this.purchaseRepository.save(
      this.purchaseRepository.create({
        ...purchaseData,
        family,
      }),
    );
  }

  private async storePurchase(family: FamilyEntity, purchase: IPurchaseInfo) {
    // TODO: Check if already purchase from Google, prevent continue with apple
    await this.purchaseRepository.save(
      this.purchaseRepository.create({
        ...purchase,
        family,
      }),
    );
  }

  private async updatePremium(family: FamilyEntity, purchase: IPurchaseInfo) {
    await this.updateFamily({
      ...family,
      ...purchase,
    });
  }

  private async removePremium(family: FamilyEntity) {
    if (family.expiresDate !== undefined) {
      // if we have expiresDate, let the premium expire by expireDate and adding span
      return;
    }

    await this.updateFamily({
      ...family,
      transactionId: undefined,
      originalTransactionId: undefined,
      productId: undefined,
      autoRenewProductId: undefined,
      autoRenewStatus: undefined,
      purchaseDate: undefined,
      originalPurchaseDate: undefined,
    });
  }

  // To bypass some eslint rules
  private buildVerifyReceiptRequestBody(receiptData: string) {
    const data = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'receipt-data': receiptData,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'exclude-old-transactions': true,
    };

    return {
      ...data,
      password: this.apiConfig.apple.itunes.appPassword,
    };
  }

  private async findFamilyOrThrow(where: FindOptionsWhere<FamilyEntity>) {
    const family = await this.commandBus.execute<
      FindFamilyCommand,
      FamilyEntity | null
    >(new FindFamilyCommand(where));

    if (family === null) {
      throw new BadRequestException('Family could not be found');
    }

    return family;
  }

  private async updateFamily(family: Partial<FamilyEntity>) {
    return this.commandBus.execute<UpdateFamilyCommand, FamilyEntity>(
      new UpdateFamilyCommand(family as FamilyEntity),
    );
  }

  private isGooglePaySubscriptionNotificationSuccess(
    notificationType: GooglePaySubscriptionNotificationType,
  ) {
    const successNotificationTypes = [
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_RECOVERED,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_RENEWED,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_PURCHASED,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_IN_GRACE_PERIOD,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_RESTARTED,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_PRICE_CHANGE_CONFIRMED,
      GooglePaySubscriptionNotificationType.SUBSCRIPTION_DEFERRED,
    ];

    return successNotificationTypes.includes(notificationType);
  }
}
