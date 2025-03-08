import { HTTPMethod } from '@/enums/method'
import { Mode } from '@/enums/mode'
import { User } from '@/schemas/users.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
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
  // @ts-ignore
  async (c) => {
    return c.json(await c.env.prisma.get_all())
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
    return c.json(await c.env.prisma.get(param.id))
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
    return c.json(await c.env.prisma.create(body.id), 201)
  }
)

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/{id}/checkout/{product_id}',
    tags: ['Users'],
    summary: 'Create a session',
    description: 'Create a session for a user to checkout',
    request: {
      params: z.object({
        id: z
          .string()
          .pipe(z.coerce.bigint().positive())
          .openapi({
            type: 'integer',
            example: '383683302801932289',
            description: 'Discord user Id',
            param: {
              name: 'id',
              in: 'path'
            }
          }),
        product_id: z.string().openapi({
          type: 'string',
          example: 'prod_RIJlRHz1yIE73x',
          description: 'Product Id',
          param: {
            name: 'product_id',
            in: 'path'
          }
        })
      }),
      query: z.object({
        mode: z.enum(['payment', 'subscription']).default('subscription')
      })
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
      apiVersion: '2025-02-24.acacia',
      typescript: true
    })
    // セール時の価格などもいろいろはいってくる
    const prices = await stripe.prices.list({ product: param.product_id })
    const base_url: string = `${new URL(c.req.url).protocol}//${new URL(c.req.url).host}`
    const sessions = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1
        }
      ],
      mode: Mode.SUBSCRIPTION,
      success_url: `${base_url}/success`,
      cancel_url: `${base_url}/cancel`
    })
    if (sessions.url === null) {
      throw new HTTPException(400, { message: 'Failed to create a session' })
    }
    if (new URL(c.req.url).hostname === 'localhost') {
      return c.redirect(new URL(sessions.url), 301)
    }
    return c.json(sessions, 200)
  }
)
