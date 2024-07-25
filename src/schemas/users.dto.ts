import { z } from '@hono/zod-openapi'
import { Subscription } from './subscription.dto'

export namespace User {
  export const Param = z.object({
    id: z
      .string()
      .regex(/\d.*/)
      .openapi({
        param: {
          name: 'id',
          in: 'path'
        },
        example: '383683302801932289'
      })
  })

  export const Data = z
    .object({
      discord_user_id: z.string().regex(/\d.*/).openapi({
        example: '383683302801932289'
      }),
      customer_id: z.nullable(
        z.string().startsWith('cus_').openapi({
          example: 'cus_QW9bgkXAg0iv50'
        })
      ),
      subscription: z.nullable(z.array(Subscription.Data).nonempty())
    })
    .openapi('User')
}
