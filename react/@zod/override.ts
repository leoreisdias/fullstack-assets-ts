import { z } from "zod";

import { ResourcesErrors } from "@/app/utils/contants/errors";

z.setErrorMap((map) => ({
  ...map,
  message: ResourcesErrors.requiredField, // In case of Internationalization
}));

const zod = {
  ...z,
  string: () => z.string().trim().min(1),
  optionalString: () => z.string().optional(),
} as typeof z & {
  optionalString: () => z.ZodOptional<z.ZodString>;
};

export { zod };
