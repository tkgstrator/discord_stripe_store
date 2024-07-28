import { Mode } from '@/enums/mode'
import { z } from '@hono/zod-openapi'
import { startTime } from 'hono/timing'
import Stripe from 'stripe'
import { Common } from './metadata.dto'
import { Product } from './product.dto'

export namespace Checkout {
  export const Param = z.object({
    client_reference_id: Common.DiscordUserId,
    guild_id: z.string().openapi({
      example: '824656929182842890',
      description: 'Discord server Id'
    }),
    success_url: z.string().url().optional().openapi({
      description:
        'The URL to which Stripe should send customers when payment or setup is complete. This parameter is not allowed if ui_mode is `embedded`. If you’d like to use information from the successful Checkout Session on your page, read the guide on customizing your success page.'
    }),
    line_items: z
      .array(
        z.object({
          id: z.string().startsWith('prod_').openapi({
            example: 'prod_QVsh2o8agtUqo4'
          }),
          name: z.string().openapi({
            description: 'The product’s name, meant to be displayable to the customer.'
          }),
          description: z.string().nullable().openapi({
            description:
              'The product’s description, meant to be displayable to the customer. Use this field to optionally store a long form explanation of the product being sold for your own rendering purposes.'
          }),
          price: z.string().startsWith('price_').openapi({
            example: 'price_1Peqv4FHNegLdPHwVySOmvrl',
            description: 'The ID of the Price or Plan object. One of `price` or `price_data` is required.'
          }),
          quantity: z.number().gte(1).openapi({
            example: 1,
            description:
              'The quantity of the line item being purchased. Quantity should not be defined when `recurring.usage_type=metered`.'
          }),
          metadata: Common.Metadata
        })
      )
      .openapi({
        description:
          'A list of items the customer is purchasing. Use this parameter to pass one-time or recurring Prices. \n\nFor `subscription` mode, there is a maximum of 20 line items with recurring Prices and 20 line items with one-time Prices. Line items with one-time Prices will be on the initial invoice only.'
      }),
    mode: z.nativeEnum(Mode).openapi({
      example: Mode.SUBSCRIPTION,
      description: 'The mode of the Checkout Session. Pass subscription if the Checkout Session includes at least one recurring item.'
    }),
    metadata: Common.Metadata
  })

  export const Data = z
    .object({
      id: z.string().startsWith('cs_').openapi({
        example: 'cs_test_a1T8W41cAbbDLwm3ARw7xM3cIr714UV0Fi953XYHSMkmEJgmuya7Ch8JC9',
        description: 'Unique identifier for the object.'
      }),
      status: z.enum(['complete', 'expired', 'open']).openapi({
        example: 'complete',
        description: 'The status of the Checkout Session, one of `complete`, `expired`, or `open`.'
      }),
      mode: z.nativeEnum(Mode).openapi({
        example: Mode.SUBSCRIPTION,
        description: 'The mode of the Checkout Session. Pass subscription if the Checkout Session includes at least one recurring item.'
      }),
      amount_total: z.number().nullable().openapi({
        example: 1000,
        description: 'Total of all items after discounts and taxes are applied.'
      }),
      payment_status: z.enum(['paid', 'unpaid', 'no_payment_required']).openapi({
        example: 'paid',
        description:
          "The payment status of the Checkout Session, one of `paid`, `unpaid`, or `no_payment_required`. You can use this value to decide when to fulfill your customer's order."
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
        }),
      url: z.string().url().optional().openapi({
        description:
          "The URL to the Checkout Session. Redirect customers to this URL to take them to Checkout. If you're using Custom Domains, the URL will use your subdomain. Otherwise, it'll use `checkout.stripe.com`. This value is only present when the session is active."
      })
    })
    .openapi('Checkout')
}
