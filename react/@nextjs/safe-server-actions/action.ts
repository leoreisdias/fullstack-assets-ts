// PURPOSE: VALIDATE BACKEND RESPONSES PATTERN ONCE THEY ARE RECEIVED
// CHECK THE `example.action.ts` FILE FOR USAGE EXAMPLE

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const action = createSafeActionClient();

const ResponseSchema = z.object({
  message: z.string().optional(),
  statusCode: z.number(),
  isSuccess: z.boolean().optional(),
});

export const getResponseSchema = (schema: z.Schema<any> = z.unknown()) =>
  ResponseSchema.extend({
    payload: schema,
    isSuccess: z.literal(true),
  }).or(ResponseSchema.extend({ isSuccess: z.literal(false) }));
