import { z } from 'zod';
import { PlanWithRelationsSchema } from './PlanSchema'
import type { PlanWithRelations } from './PlanSchema'
import { SubscriptionWithRelationsSchema } from './SubscriptionSchema'
import type { SubscriptionWithRelations } from './SubscriptionSchema'

/////////////////////////////////////////
// ITEM SCHEMA
/////////////////////////////////////////

export const ItemSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  planId: z.string(),
  subscriptionId: z.string().nullable(),
})

export type Item = z.infer<typeof ItemSchema>

/////////////////////////////////////////
// ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ItemRelations = {
  plan: PlanWithRelations;
  Subscription?: SubscriptionWithRelations | null;
};

export type ItemWithRelations = z.infer<typeof ItemSchema> & ItemRelations

export const ItemWithRelationsSchema: z.ZodType<ItemWithRelations> = ItemSchema.merge(z.object({
  plan: z.lazy(() => PlanWithRelationsSchema),
  Subscription: z.lazy(() => SubscriptionWithRelationsSchema).nullable(),
}))

export default ItemSchema;
