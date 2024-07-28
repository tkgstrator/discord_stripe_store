import { z } from '@hono/zod-openapi'

export namespace Common {
  export const DiscordUserId = z.string().openapi({
    example: '383683302801932289',
    description: 'Discord user Id'
  })

  export const CustomerId = z.nullable(
    z.string().startsWith('cus_').openapi({
      example: 'cus_QW9bgkXAg0iv50'
    })
  )

  export const Metadata = z
    .record(z.union([z.string(), z.number()]))
    // .transform((data) => {
    //   if (data === null) {
    //     return null
    //   }
    //   return Object.entries(data).map(([key, value]) => {
    //     if (Number.isNaN(Number(value))) {
    //       return { [key]: value }
    //     }
    //     return { [key]: Number(value) }
    //   })
    // })
    .openapi({
      example: {},
      description:
        'Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.'
    })
}
