# 📖 Fullstack-Assets Repository Documentation

This repository contains a collection of **reusable fullstack assets**, including **hooks, components, utilities, and structures** for **NestJS, Next.js, and isomorphic code**. The code here is not meant to be installed as a package but rather to be **copied and reused** as needed.

## 📂 Repository Structure

The repository is organized into three main directories:

### 🏗️ **Isomorphic** (`/isomorphic`)

📌 Contains code that can be used in both **frontend (Next.js)** and **backend (NestJS)**.

🔹 **[`isomorphic/dates/`](./isomorphic/dates/README.md)** → Handlers and utilities for date manipulation.
🔹 **[`isomorphic/prisma-helpers/`](./isomorphic/prisma-helpers/README.md)** → Selectors and typings for Prisma usage in both front and back.

---

### 🚀 **NestJS** (`/nestjs`)

📌 Contains structure for **NestJS**, including a `shared/` module for monorepos or microservices.

🔹 **[`nestjs/shared/`](./nestjs/shared/README.md)** → Reusable code for NestJS microservices (decorators, DTOs, guards, interceptors, etc.).
🔹 **[`nestjs/infra/`](./nestjs/infra/README.md)** → Infrastructure configurations (e.g., Docker).

---

### 🎨 **React & Next.js** (`/react`)

📌 Contains **hooks, components, and utilities** for **React and Next.js**.

🔹 **[`react/@components/`](./react/@components/README.md)** → Reusable components (Advanced Filters, Big Calendar, etc.).
🔹 **[`react/@hooks/`](./react/@hooks/README.md)** → Custom hooks for React (use-fetch, use-scroll-bottom, etc.).
🔹 **[`react/@nextjs/`](./react/@nextjs/README.md)** → Next.js-specific helpers.
🔹 **[`react/@zod/`](./react/@zod/README.md)** → Helpers for Zod validation.
🔹 **[`react/@CASL/`](./react/@CASL/README.md)** → CASL permission control implementation.

---

## 🔗 Documentation Links

- [Isomorphic Documentation](./isomorphic/README.md)
- [NestJS Documentation](./nestjs/README.md)
- [React & Next.js Documentation](./react/README.md)

This repository is **a collection of tools and patterns** that can be used in fullstack projects. Feel free to copy, adapt, and modify as needed. 🚀
