import { HTTPMethod } from '@/enums/method'
import { Mode } from '@/enums/mode'
import { User } from '@/schemas/users.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import Stripe from 'stripe'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['Users'],
    summary: 'List all users',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(User.Data)
          }
        },
        description: 'Find users'
      }
    }
  }),
  async (c) => {
    const keys: string[] = (await c.env.STRIPE_DISCORD_STORE_USERS.list({ limit: 20 })).keys.map((key) => key.name)
    const users = (await Promise.all(keys.map(async (key) => c.env.STRIPE_DISCORD_STORE_USERS.get(key, { type: 'json' })))).map((user) =>
      User.Data.parse(user)
    )
    return c.json(users, 200)
  }
)
app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/{id}',
    tags: ['Users'],
    summary: 'Retrieve a user',
    request: {
      params: User.Param
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: User.Data
          }
        },
        description: 'Find a user'
      },
      404: {
        description: 'User not found'
      }
    }
  }),
  async (c) => {
    const param = c.req.valid('param')
    const user = User.Data.parse(await c.env.STRIPE_DISCORD_STORE_USERS.get(param.id.toString(), { type: 'json' }))
    return c.json(user, 200)
  }
)
app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['Users'],
    summary: 'Create a user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: User.Param
          }
        },
        required: true
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: User.Data
          }
        },
        description: 'Create a user'
      },
      400: {
        description: 'Bad request'
      }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const user = User.Data.parse({
      discord_user_id: body.id.toString(),
      customer_id: null,
      subscription: null
    })
    c.executionCtx.waitUntil(c.env.STRIPE_DISCORD_STORE_USERS.put(user.discord_user_id, JSON.stringify(user)))
    return c.json(user, 201)
  }
)
app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/{id}/checkout',
    tags: ['Users'],
    summary: 'Create a session',
    description: 'Create a session for a user to checkout',
    request: {
      params: User.Checkout.Param
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: User.Data
          }
        },
        description: 'Retrieve urls to checkout'
      },
      404: {
        description: 'User not found'
      }
    }
  }),
  async (c) => {
    const param = c.req.valid('param')
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true
    })
    const products = await stripe.products.list({ limit: 100, active: true })
    const sessions = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: products.data[0].id,
          quantity: 1
        }
      ],
      client_reference_id: param.id.toString(),
      mode: Mode.SUBSCRIPTION
    })
    return c.json(
      {
        discord_user_id: '430364540899819520',
        customer_id: null,
        subscription: null
      },
      200
    )
  }
)
