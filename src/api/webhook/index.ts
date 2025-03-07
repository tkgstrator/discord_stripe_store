import { HTTPMethod } from '@/enums/method'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute } from '@hono/zod-openapi'

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
    return c.json({})
  }
)
