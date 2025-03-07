import { z } from '@hono/zod-openapi'

export namespace Plan {
  export const Data = z
    .object({
      id: z.string().startsWith('price_').openapi({
        example: 'price_1Peqv4FHNegLdPHwVySOmvrl'
      }),
      product: z.string().startsWith('prod_').openapi({
        example: 'prod_QVsg3itu0abtmY'
      }),
      active: z.boolean().openapi({
        example: true
      }),
      amount: z.number().gte(0).openapi({
        example: 500
      })
    })
    .openapi('Plan')
}

export namespace Subscription {
  export const Data = z
    .object({
      id: z.string().openapi({
        example: 'sub_1Pf7IEFHNegLdPHwqSUkYHSS'
      }),
      current_period_start: z.string().datetime({}).openapi({
        example: '2024-01-01T00:00:00.000Z'
      }),
      current_period_end: z.string().datetime({}).openapi({
        example: '2024-02-01T00:00:00.000Z'
      }),
      items: z
        .array(
          z.object({
            id: z.string().startsWith('si_').openapi({
              example: 'si_QW9b98JfxLsnK1'
            }),
            plan: Plan.Data
          })
        )
        .openapi({
          example: [
            {
              id: 'si_QW9b98JfxLsnK1',
              plan: {
                id: 'price_1Peqv4FHNegLdPHwVySOmvrl',
                product: 'prod_QVsg3itu0abtmY',
                active: true,
                amount: 500
              }
            }
          ]
        })
    })
    .openapi('Subscription')
}
