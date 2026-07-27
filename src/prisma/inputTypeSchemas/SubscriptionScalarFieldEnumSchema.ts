import { z } from 'zod';

export const SubscriptionScalarFieldEnumSchema = z.enum(['id','currentPeriodEnd','currentPeriodStart','createdAt','updatedAt','userId']);

export default SubscriptionScalarFieldEnumSchema;
