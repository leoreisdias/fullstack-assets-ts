# 🛠️ Utilities (`react/@utils`)

This folder contains **general utility functions** that simplify common operations and improve code reusability. Currently, it includes a helper for managing **FormData** in a structured way.

## 📌 Current Utility

### `form-data.ts`

A helper function for **appending different types of values** (files, numbers, booleans, dates, arrays) to a `FormData` object in a consistent and predictable manner.

**Example Use Case:**

- Preparing data for API requests that require `multipart/form-data`.
- Ensuring correct serialization of arrays, objects, and file uploads.

**Example Usage:**

```tsx
import { appendFormData } from "@/utils/form-data";

const payload = {
  name: "John Doe",
  age: 30,
  profilePicture: selectedFile, // File instance
  preferences: ["dark-mode", "notifications"],
  metadata: { role: "admin" },
};

const formData = appendFormData(payload);

fetch("/api/upload", {
  method: "POST",
  body: formData,
});
```

---

## 🎯 Why This Utility?

- **Simplifies FormData creation** → No need to manually handle `FormData.append` for different data types.
- **Ensures type safety** → Converts values properly to avoid common serialization issues.
- **Handles nested data** → Supports arrays, objects, and files in a predictable format.

This folder will grow as more utilities are added! 🚀
