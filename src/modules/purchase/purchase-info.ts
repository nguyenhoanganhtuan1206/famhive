import type { PaymentPlatform } from './../../constants/payment-platform';
export interface IPurchaseInfo {
  transactionId?: string;

  originalTransactionId?: string;

  productId?: string;

  autoRenewProductId?: string;

  autoRenewStatus?: boolean;

  purchaseDate?: Date;

  originalPurchaseDate?: Date;

  expiresDate?: Date;

  paymentPlatform?: PaymentPlatform;
}

export interface IGooglePurchaseInfo extends IPurchaseInfo {
  priceCurrencyCode?: string;

  priceAmountMicros?: string;

  countryCode?: string;

  paymentState?: number;

  purchaseType?: number;

  purchaseToken?: string;
}

export interface IGooglePurchaseNotificationInfo {
  version: string;
  packageName: string;
  eventTimeMillis: string;
  subscriptionNotification: ISubscriptionNotification;
}

export interface ISubscriptionNotification {
  version: string;
  notificationType: number;
  purchaseToken: string;
  subscriptionId: string;
}
