export enum EventType {
  /**
   * チェックアウト完了時
   */
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
  /**
   * サブスクリプション作成時
   */
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  /**
   * サブスクリプション削除時
   */
  CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  /**
   * サブスクリプション更新時
   */
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  /**
   * 支払い失敗時
   */
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
  /**
   * 支払い成功時
   */
  INVOICE_PAYMENT_SUCCEEDED = 'invoice.payment_succeeded'
}
