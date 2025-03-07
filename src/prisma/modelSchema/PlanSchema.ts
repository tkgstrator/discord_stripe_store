import { z } from 'zod';
import { ItemWithRelationsSchema } from './ItemSchema'
import type { ItemWithRelations } from './ItemSchema'

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.string(),
  product: z.string(),
  active: z.boolean(),
  amount: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Plan = z.infer<typeof PlanSchema>

/////////////////////////////////////////
// PLAN RELATION SCHEMA
/////////////////////////////////////////

export type PlanRelations = {
  Item: ItemWithRelations[];
};

export type PlanWithRelations = z.infer<typeof PlanSchema> & PlanRelations

export const PlanWithRelationsSchema: z.ZodType<PlanWithRelations> = PlanSchema.merge(z.object({
  Item: z.lazy(() => ItemWithRelationsSchema).array(),
}))

export default PlanSchema;
