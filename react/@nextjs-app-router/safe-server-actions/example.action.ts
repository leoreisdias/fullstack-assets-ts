'use server';

import { action, getResponseSchema } from '@/app/lib/actions/action-client';
import { sender } from '@/app/lib/api';
import { handleAPIError } from '@/app/lib/errors';
import { ResourcesErrors } from '@/app/utils/contants/errors';
import { zod } from '@/app/validations';

const exampleSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6).max(20),
});

type ExampleSchema = Zod.infer<typeof exampleSchema>;

const exampleResponseSchema = getResponseSchema(
  zod.object({
    user: zod.object({
      id: zod.number(),
      name: zod.string(),
      email: zod.string().email(),
    }),
  }),
);

export const example = action(exampleSchema, async (payload: ExampleSchema) => {
  try {
    const { data } = await sender({
      method: 'POST',
      url: '/example',
      data: payload,
    });

    const response = exampleResponseSchema.safeParse(data);
    if (response.success) {
      return response;
    }

    return handleAPIError({}, ResourcesErrors.invalidAPIResponse);
  } catch (err) {
    return handleAPIError(err);
  }
});
