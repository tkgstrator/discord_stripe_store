export enum Status {
  /**
   * サブスクリプションが有効で継続中
   */
  ACTIVE = 'active',
  /**
   * キャンセル済み
   */
  CANCELED = 'canceled',
  /**
   * 初回支払失敗または未完了
   */
  INCOMPLETE = 'incomplete',
  /**
   * 初回支払失敗後、期限超過
   */
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  /**
   * 支払い期限超過
   */
  PAST_DUE = 'past_due',
  /**
   * サブスクリプション一時停止中
   */
  PAUSED = 'paused',
  /**
   * 試用期間中
   */
  TRIALING = 'trialing',
  /**
   * 支払期限釣果かつ再試行失敗
   */
  UNPAID = 'unpaid'
}
