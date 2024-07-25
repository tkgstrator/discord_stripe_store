import { HTTPMethod } from '@/enums/method'
import { User } from '@/schemas/users.dto'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(User.Data)
          }
        },
        description: 'Retrieve users'
      }
    }
  }),
  (c) => {
    return c.json(
      [
        {
          discord_user_id: '430364540899819520',
          customer_id: '123',
          subscription: null
        }
      ],
      200
    )
  }
)
app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/{id}',
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
        description: 'Retrieve the user'
      }
    }
  }),
  (c) => {
    const { id } = c.req.valid('param')
    return c.json(
      {
        discord_user_id: id,
        customer_id: '123',
        subscription: null
      },
      200
    )
  }
)
