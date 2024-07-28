import { HTTPMethod } from '@/enums/method'
import { Mode } from '@/enums/mode'
import { UIMode } from '@/enums/ui_mode'
import { Checkout } from '@/schemas/checkout.dto'
import { Product } from '@/schemas/product.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import Stripe from 'stripe'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/sessions',
    tags: ['Checkout'],
    summary: 'Create a Session',
    description: 'Creates a Session object.',
    request: {
      body: {
        description: 'The Session object to create.',
        content: {
          'application/json': {
            schema: Checkout.Param
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(Checkout.Data)
          }
        },
        description:
          'A object with a data property that contains an array of up to limit products, starting after product starting_after. Each entry in the array is a separate product object. If no more products are available, the resulting array will be empty.'
      }
    }
  }),
  async (c) => {
    const param = c.req.valid('json')
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true
    })
    const sessions = await Promise.all(
      param.line_items.map((item) => {
        return stripe.checkout.sessions.create({
          success_url: `https://discord.com/channels/${param.guild_id}`,
          line_items: [
            {
              price: item.price,
              quantity: item.quantity
            }
          ],
          client_reference_id: param.client_reference_id,
          metadata: Object.assign(param.metadata, { name: item.name, description: item.description ?? undefined }),
          mode: Mode.SUBSCRIPTION
        })
      })
    )
    return c.json(
      sessions.map((session) => Checkout.Data.parse(session)),
      200
    )
  }
)
