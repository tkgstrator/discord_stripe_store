import { z } from 'zod';

export const ItemScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','planId','subscriptionId']);

export default ItemScalarFieldEnumSchema;
