## Discord Stripe Store

StripeからのWebhookを受け取ってCloudflare KVに保存します.

`client_reference_id`に`discord_user_id`が含めることでDiscordとの連携が可能になります.

### 対応Webhhook

- [ ] checkout.session.completed
- [ ] customer.subscription.created
- [ ] customer.subscription.deleted
- [ ] customer subscription.updated
- [ ] invoice.payment_failed
- [ ] invoice.payment_succeeded

### エンドポイント

- [ ] /users
- [ ] /users/:discord_user_id
- [ ] /subscriptions
- [ ] /subscriptions/:subscription_id

> 一部の機能は管理者限定機能です

### フォーマット

以下の形式でJSONフォーマットとして保存されます

```json
{
  "discord_user_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "customer_id": "cus_xxxxxxxxxxxxxx",
  "subscription": [
    {
      "id": "sub_xxxxxxxxxxxxxx",
      "current_period_start": "2024-01-01T00:00:00Z",
      "current_period_end": "2024-01-01T00:00:00Z",
      "items": [
        {
          "id": "si_xxxxxxxxxxxxxx",
          "plan": {
            "id": "price_xxxxxxxxxxxxxx",
            "product": "prod_xxxxxxxxxxxxxx"
            "active": true,
            "amount": 1000,
            "usage_type": "licensed"
          }
        }
      ]
    }
  ]
}
```
