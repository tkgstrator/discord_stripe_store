import { z } from 'zod';

export const PlanScalarFieldEnumSchema = z.enum(['id','product','active','amount','createdAt','updatedAt']);

export default PlanScalarFieldEnumSchema;
