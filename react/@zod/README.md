# 🛠️ Zod Utilities (`react/@zod`)

This folder contains **custom Zod utilities and overrides** to improve schema validation in the project. It extends Zod with additional functionality while ensuring a consistent error messaging structure.

## 📌 Current Utility

### `override.ts`

A custom **Zod extension** that:

- **Overrides default error messages** to support internationalization (i18n).
- **Provides pre-configured string validation helpers** for common cases like required and optional strings.

**Example Use Case:**

- Enforcing **trimmed non-empty strings** by default.
- Standardizing error messages across different validation schemas.
- Simplifying optional field handling without needing `.optional()` every time.

**Example Usage:**

```tsx
import { zod } from "@/zod/override";

const schema = zod.object({
  name: zod.string(), // Always trims and ensures a non-empty value
  email: zod.optionalString(), // Optional but still ensures string type
});

const result = schema.safeParse({ name: "   John Doe  ", email: "" });
console.log(result.success); // true
```

---

## 🎯 Why This Utility?

- **Consistent validation rules** → Ensures all strings are properly trimmed and non-empty.
- **Easier optional handling** → Reduces repetitive `.optional()` calls.
- **Standardized error messages** → Uses a global error map to support i18n-friendly validation messages.

As the project grows, more custom validation utilities may be added here! 🚀
