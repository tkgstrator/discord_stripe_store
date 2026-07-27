import { z } from 'zod';
import { SubscriptionWithRelationsSchema } from './SubscriptionSchema'
import type { SubscriptionWithRelations } from './SubscriptionSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  subscriptions: SubscriptionWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  subscriptions: z.lazy(() => SubscriptionWithRelationsSchema).array(),
}))

export default UserSchema;
