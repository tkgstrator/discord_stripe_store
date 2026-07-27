import { z } from 'zod';

/////////////////////////////////////////
// CHECKOUT SCHEMA
/////////////////////////////////////////

export const CheckoutSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Checkout = z.infer<typeof CheckoutSchema>

export default CheckoutSchema;
