import { z } from '@hono/zod-openapi'
import { Common } from './metadata.dto'

export namespace Product {
  export const Param = z.object({
    limit: z
      .string()
      .pipe(z.coerce.number().int().gt(0).lte(100).default(100))
      .optional()
      .openapi({
        type: 'integer',
        param: {
          name: 'limit',
          in: 'query'
        }
      }),
    active: z
      .string()
      .pipe(z.coerce.boolean().default(true))
      .optional()
      .openapi({
        type: 'boolean',
        param: {
          name: 'active',
          in: 'query'
        }
      }),
    ids: z
      .array(z.string())
      .optional()
      .openapi({
        param: {
          name: 'ids',
          in: 'query'
        }
      }),
    shippable: z
      .boolean()
      .pipe(z.coerce.boolean())
      .optional()
      .openapi({
        type: 'boolean',
        param: {
          name: 'shippable',
          in: 'query'
        }
      }),
    ending_before: z
      .string()
      .optional()
      .openapi({
        param: {
          name: 'ending_before',
          in: 'query'
        }
      }),
    starting_after: z
      .string()
      .optional()
      .openapi({
        param: {
          name: 'starting_after',
          in: 'query'
        }
      }),
    url: z
      .string()
      .optional()
      .openapi({
        param: {
          name: 'url',
          in: 'query'
        }
      })
  })

  export const Data = z
    .object({
      id: z.string().startsWith('prod_').openapi({
        example: 'prod_QVsh2o8agtUqo4'
      }),
      object: z.string().openapi({
        example: 'product'
      }),
      default_price: z.nullable(z.string().startsWith('price_')).openapi({
        example: 'price_1Peqv4FHNegLdPHwVySOmvrl'
      }),
      name: z.string().openapi({
        example: 'Product Name'
      }),
      description: z.nullable(z.string()).openapi({
        example: 'Product Description'
      }),
      active: z.boolean().openapi({
        example: true
      }),
      livemode: z.boolean().openapi({
        example: true
      }),
      metadata: z
        .record(z.union([z.string(), z.number()]))
        .transform((data) => {
          if (data === null) {
            return null
          }
          const entries = Object.entries(data).map(([key, value]) => {
            if (Number.isNaN(Number(value))) {
              return { [key]: value }
            }
            return { [key]: Number(value) }
          })
          console.log(Object.assign({}, ...entries))
          return Object.assign({}, ...entries)
        })
        .openapi({
          example: {},
          description:
            'Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.'
        })
    })
    .openapi('Product')
}
