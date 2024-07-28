import { z } from '@hono/zod-openapi'
import { Common } from './metadata.dto'
import { Subscription } from './subscription.dto'

export namespace User {
  export const Param = z.object({
    id: Common.DiscordUserId.openapi({
      param: {
        name: 'id',
        in: 'path'
      }
    })
  })

  export const Data = z
    .object({
      discord_user_id: Common.DiscordUserId,
      customer_id: Common.CustomerId,
      subscription: z.nullable(z.array(Subscription.Data).nonempty())
    })
    .openapi('User')

  export namespace Checkout {
    export const Param = z.object({
      id: Common.DiscordUserId.openapi({
        param: {
          name: 'id',
          in: 'path'
        }
      })
    })
  }

  export type Data = z.infer<typeof User.Data>
  export type Param = z.infer<typeof User.Param>
}
