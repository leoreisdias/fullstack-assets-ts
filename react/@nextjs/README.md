# 🌍 Next.js Utilities (`react/@nextjs`)

This folder contains **Next.js-specific utilities** to improve API handling, authentication, error management, and server actions. These utilities are designed to work with Next.js **App Router** and integrate seamlessly with authentication libraries like **NextAuth**.

## 📌 Contents

### 🛰️ API Fetching & Sending

- **`fetcher-sender.ts`** → A **unified and structured way** to perform API requests in Next.js, ensuring **consistent error handling, automatic token injection, and response formatting** across the application.
  - Uses **`fetcher`** for **fetch-based API calls** and **`sender`** for **axios-based API calls**.
  - Implements a **universal error handling system** that sanitizes errors and prevents sensitive data leakage.
  - Uses **`tryCatch`** as a generic wrapper for promises, allowing safe execution of async functions.

#### **Example Use Case:**

- Securely fetching API data while **automatically injecting authentication tokens**.
- Standardizing API responses to ensure **consistent success/error formats**.
- Making **typed API calls with minimal setup**, ensuring type safety across the application.
- Using the **`sender`** for APIs that require **custom headers, query params, or timeouts**.

---

### 🚨 Error Handling

- **`errors/handleError.ts`** → A **centralized API error handler** that:
  - Standardizes API response errors for **both `fetcher` and `sender`**.
  - Prevents exposing **sensitive backend details** (e.g., Prisma, SQL, internal server stack traces).
  - Returns **clean, user-friendly messages** while keeping logs for debugging.

#### **Example Use Case:**

- Catching API errors and displaying **controlled error messages** instead of exposing raw API failures.
- Automatically filtering out errors containing **sensitive backend information**.

---

### 🔀 Route Handlers

- **`route-handlers/proxy-logic.ts`** → A **server-side API proxy**, allowing Next.js to relay requests to other services securely.
  - Useful for **microservices architecture** or acting as an **API gateway**.
  - Works **inside or outside a Kubernetes cluster**, making it ideal for managing multiple backend services.

#### **Example Use Case:**

- Using Next.js as an **API gateway** to forward requests to microservices while **hiding API keys and internal endpoints**.
- Centralizing API requests under the Next.js backend to avoid **CORS issues and frontend exposure**.

---

## 🎯 Why These Utilities?

✅ **Secure API handling** → Automatically injects authentication and ensures secure API calls.  
✅ **Better error management** → Handles API errors **globally** for a smoother user experience.  
✅ **Optimized data fetching** → Implements **SWR-like behaviors** for **server-side and client-side optimization**.  
✅ **Standardized responses** → Keeps API responses **structured, typed, and predictable**.

These utilities are designed to make your **Next.js development more efficient, scalable, and resilient**. Feel free to use, adapt, and integrate them into your projects! 🚀
