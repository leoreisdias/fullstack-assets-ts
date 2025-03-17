#### 📄 `isomorphic/README.md`

# 🔗 Isomorphic Utilities (`isomorphic/`)

This folder contains **reusable utilities** that can be copied and used in both **backend (NestJS)** and **frontend (Next.js)** environments. These utilities are not meant to be shared dynamically between front and back but rather to be easily adaptable to either context as needed.

## 📌 Contents:

- **[`dates/`](./dates/README.md)** → Utilities for handling and formatting dates.
- **[`prisma-utils/`](./prisma-utils/README.md)** → Helpers for optimizing Prisma ORM queries and selectors.

## 🔀 Why Isomorphic Utilities?

The goal of this folder is to provide **portable code** that can be independently used in frontend or backend projects without modifications. Instead of writing separate implementations for different environments, these utilities can be **copied and adapted** where needed.

### 🔹 Benefits:

- **Code flexibility** → Easily copy functions to either frontend or backend without adjustments.
- **Efficiency** → Saves development time by avoiding redundant implementations.
- **Simplifies maintenance** → Provides tested utilities that can be used in multiple contexts.

## 🏗️ Use Cases

- **Using Prisma query selectors** in either backend services or frontend API handlers.
- **Applying standardized date formatting and parsing** in backend logic or frontend UI components.
- **Providing reusable logic** that can be adapted without depending on a centralized shared codebase.

This module **streamlines development** by offering ready-to-use utilities for both frontend and backend applications. 🚀
