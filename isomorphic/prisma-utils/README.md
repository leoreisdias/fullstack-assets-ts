# 🗄️ Prisma Utilities (`isomorphic/prisma-utils`)

This folder contains **predefined Prisma selectors** to improve query efficiency and enforce **consistent data retrieval**. These utilities are designed for use in both **backend (NestJS)** and **frontend (Next.js)** environments.

## 📌 Contents:

- `selectors-example.ts` → Example of a Prisma selector using `Prisma.validator`.

## 🔍 Prisma Selectors (`selectors-example.ts`)

These selectors define **reusable query patterns** to ensure **consistent and optimized** data fetching.

### 🔹 Features:

- **Reusable field selection** → Avoids redundant `select` objects across multiple queries.
- **Optimized data fetching** → Ensures only necessary fields are queried, improving performance.
- **Encapsulation of business rules** → Prevents unnecessary exposure of sensitive fields.

### 🛠️ Example Usage:

```ts
import { myUseCaseSelector } from "./selectors-example";
import { prisma } from "../prisma-instance";

const data = await prisma.myTable.findUnique({
  where: { id: 1 },
  select: myUseCaseSelector,
});
```

## 🏗️ Use Cases

- **Ensure data consistency** → Prevents incorrect or incomplete queries.
- **Optimize database queries** → Use predefined selectors to improve performance.
- **Encapsulate query logic** → Centralize and reuse field selection strategies across services.

This module **simplifies Prisma usage** by standardizing queries and reducing redundancy. 🚀
