import { EventType } from '@/enums/event_type'
import { HTTPMethod } from '@/enums/method'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import Stripe from 'stripe'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['Webhooks'],
    summary: 'Webhook Endpoints',
    description:
      'Most users configure webhooks from the dashboard, which provides a user interface for registering and testing your webhook endpoints.',
    responses: {
      204: {
        description: 'No contents'
      }
    }
  }),
  async (c) => {
    const signature: string | undefined = c.req.header('stripe-signature')
    if (signature === undefined) {
      throw new HTTPException(400, { message: 'Stripe signature is missing' })
    }
    const body: string = await c.req.text()
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true
    })
    const event: Stripe.Event = await stripe.webhooks.constructEventAsync(body, signature, c.env.STRIPE_WEBHOOK_SECRET)
    switch (event.type) {
      case EventType.CHECKOUT_SESSION_COMPLETED:
        console.log('[CHECKOUT_SESSION_COMPLETED]', event.data.object)
        break
      case EventType.CUSTOMER_SUBSCRIPTION_CREATED:
        console.log('[CUSTOMER_SUBSCRIPTION_CREATED]', event.data.object)
        break
      case EventType.CUSTOMER_SUBSCRIPTION_DELETED:
        console.log('[CUSTOMER_SUBSCRIPTION_DELETED]', event.data.object)
        break
      case EventType.CUSTOMER_SUBSCRIPTION_UPDATED:
        console.log('[CUSTOMER_SUBSCRIPTION_UPDATED]', event.data.object)
        break
      case EventType.INVOICE_PAYMENT_FAILED:
        console.log('[INVOICE_PAYMENT_FAILED]', event.data.object)
        break
      case EventType.INVOICE_PAYMENT_SUCCEEDED:
        console.log('[INVOICE_PAYMENT_SUCCEEDED]', event.data.object)
        break
      default:
        console.log('[UNKNOWN_EVENT]', event.type)
        break
    }
    return c.json({})
  }
)
