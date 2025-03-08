import type Prisma from './db'

export type Bindings = {
  DB: D1Database
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_DISCORD_STORE_USERS: KVNamespace
  STRIPE_DISCORD_STORE_SUBSCRIPTIONS: KVNamespace
  prisma: Prisma
}
