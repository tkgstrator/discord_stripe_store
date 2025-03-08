import { z } from 'zod';
import { ItemWithRelationsSchema } from './ItemSchema'
import type { ItemWithRelations } from './ItemSchema'
import { UserWithRelationsSchema } from './UserSchema'
import type { UserWithRelations } from './UserSchema'

/////////////////////////////////////////
// SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const SubscriptionSchema = z.object({
  id: z.string(),
  currentPeriodEnd: z.coerce.date(),
  currentPeriodStart: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().nullable(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/////////////////////////////////////////
// SUBSCRIPTION RELATION SCHEMA
/////////////////////////////////////////

export type SubscriptionRelations = {
  items: ItemWithRelations[];
  User?: UserWithRelations | null;
};

export type SubscriptionWithRelations = z.infer<typeof SubscriptionSchema> & SubscriptionRelations

export const SubscriptionWithRelationsSchema: z.ZodType<SubscriptionWithRelations> = SubscriptionSchema.merge(z.object({
  items: z.lazy(() => ItemWithRelationsSchema).array(),
  User: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

export default SubscriptionSchema;
