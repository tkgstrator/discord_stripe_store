## Discord Stripe Store

StripeからのWebhookを受け取ってCloudflare KVに保存します.

`client_reference_id`に`discord_user_id`が含めることでDiscordとの連携が可能になります.

## 要件

- VSCode
- Docker(Docker Desktop推奨)

DevContainerの拡張機能をします.

### 環境変数

- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`

Stripeの開発者用ダッシュボードからWebhookの署名シークレットである`STRIPE_WEBHOOK_SECRET`とAPIキーのシークレットである`STRIPE_SECRET_KEY`をコピーして設定します.

#### 開発環境

```zsh
cp .dev.vars.example .dev.vars
```

開発環境のシークレットは.dev.varsに保存します.

本番環境のシークレットを保存してはいけません.

#### 本番環境

`wrangler`を利用して環境変数を設定します.

```zsh
bun wrangler secret put STRIPE_WEBHOOK_SECRET
bun wrangler secret put STRIPE_SECRET_KEY
```

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

以下の形式でJSONフォーマットとして保存されます.

サブスクリプション以外の支払いには現在対応していません.

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