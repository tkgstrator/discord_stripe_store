import { z } from '@hono/zod-openapi'
import { startTime } from 'hono/timing'
import Stripe from 'stripe'

export namespace Checkout {
  export const Param = z.object({
    id: z
      .string()
      .pipe(z.coerce.bigint().positive())
      .openapi({
        type: 'integer',
        example: '383683302801932289',
        description: 'Discord user Id',
        param: {
          name: 'id',
          in: 'query'
        }
      })
  })
}
