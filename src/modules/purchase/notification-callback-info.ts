import type { IPurchaseInfo } from './purchase-info';

export interface INotificationCallbackInfo {
  isSuccess: boolean;

  purchase: IPurchaseInfo;
}
