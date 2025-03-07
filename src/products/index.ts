import { HTTPMethod } from '@/enums/method'
import { Product } from '@/schemas/product.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { cache } from 'hono/cache'
import Stripe from 'stripe'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['Products'],
    summary: 'List all products',
    description:
      'Returns a list of your products. The products are returned sorted by creation date, with the most recently created products appearing first.',
    request: {
      query: Product.Param
    },
    middleware: [
      cache({
        cacheName: 'products',
        cacheControl: 'max-age=3600'
      })
    ],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(Product.Data)
          }
        },
        description:
          'A object with a data property that contains an array of up to limit products, starting after product starting_after. Each entry in the array is a separate product object. If no more products are available, the resulting array will be empty.'
      }
    }
  }),
  async (c) => {
    const param = c.req.valid('query')
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true
    })
    const products = (await stripe.products.list({ limit: param.limit, active: true })).data.map((product) => Product.Data.parse(product))
    return c.json(products, 200)
  }
)
