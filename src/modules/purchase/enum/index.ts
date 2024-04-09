export enum CancelReason {
  USER_CANCELED = 0,
  SUBSCRIPTION_WAS_CANCELED_BY_SYSTEM = 1,
  SUBSCRIPTION_WAS_REPLACED = 2,
  SUBSCRIPTION_WAS_CANCELED = 3,
}

// Note: For google pay, the purchase type has value if the method includes on of those below-value
export enum PurchaseType {
  TEST = 0,
  PROMO = 1,
}

export enum PaymentState {
  PENDING = 0,
  RECEIVED = 1,
  FREE_TRIAL = 2,
  PENDING_UPGRADE_OR_DOWNGRADE = 3,
  PURCHASED = 4,
  FAILED = 5,
}

export enum GooglePaySubscriptionNotificationType {
  SUBSCRIPTION_RECOVERED = 1, // - A subscription was recovered from account hold.
  SUBSCRIPTION_RENEWED = 2, // - An active subscription was renewed.
  SUBSCRIPTION_CANCELED = 3, // - A subscription was either voluntarily or involuntarily cancelled
  SUBSCRIPTION_PURCHASED = 4, // - A new subscription was purchased.
  SUBSCRIPTION_ON_HOLD = 5, // - A subscription has entered account hold (if enabled).
  SUBSCRIPTION_IN_GRACE_PERIOD = 6, // - A subscription has entered grace period (if enabled).
  SUBSCRIPTION_RESTARTED = 7, // - User has restored their subscription. The subscription was canceled but had not expired yet when the user restores.
  SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8, // - A subscription price change has successfully been confirmed by the user.
  SUBSCRIPTION_DEFERRED = 9, // - A subscription's recurrence time has been extended.
  SUBSCRIPTION_PAUSED = 10, // - A subscription has been paused.
  SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11, // - A subscription pause schedule has been changed.
  SUBSCRIPTION_REVOKED = 12, // - A subscription has been revoked from the user before the expiration time.
  SUBSCRIPTION_EXPIRED = 13, // - A subscription has expired.
}
