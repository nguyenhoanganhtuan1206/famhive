export interface IGoogleCloudNotification {
  message: IMessage;
  subscription: string;
}

export interface IMessage {
  data: string;
  messageId: string;
  message_id: string;
  publishTime: string;
  publish_time: string;
}

export interface IDecodedGoogleCloudNotification {
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
