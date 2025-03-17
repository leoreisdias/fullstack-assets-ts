# 🌍 Next.js Utilities (`react/@nextjs`)

This folder contains **Next.js-specific utilities** to improve API handling, authentication, error management, and server actions. These utilities are designed to work with Next.js **App Router** and integrate seamlessly with authentication libraries like **NextAuth**.

## 📌 Contents

### 🛰️ API Fetching & Sending

- **`fetcher-sender.ts`** → A **unified way** to perform API requests in Next.js, ensuring **consistent error handling and response formatting** across the application. These utilities provide **easy type inference** through generics, making API calls simpler and safer.

**Example Use Case:**

- Securely fetching API data with automatic token injection.
- Standardizing API responses and error handling across different services.
- Making typed API calls with minimal setup.

### 🚨 Error Handling

- **`errors/handleAPIError.ts`** → Centralized API error handler that standardizes API response errors.

**Example Use Case:**

- Catching API errors and displaying user-friendly messages instead of raw error responses.

### 🔀 Route Handlers

- **`route-handlers/proxy-logic.ts`** → A server-side **proxy for acting as an API gateway**, allowing Next.js to securely relay requests to other services. This is useful when managing **multiple microservices**, whether they are inside a Kubernetes cluster or external services.

**Example Use Case:**

- Using Next.js as an API gateway to route authenticated requests to internal or external services without exposing API keys.
- Fetching user data from an external API while keeping requests server-only.

### 🔒 Safe Server Actions

- **`safe-server-actions/action.ts`** → Wrapper for Next.js **server actions**, enforcing schema validation with Zod.
- **`safe-server-actions/example.action.ts`** → Example implementation of a **safe server action** with API integration.

**Example Use Case:**

- Ensuring that user-submitted data matches the expected schema before processing.
- Handling API requests securely within server actions.

### 🏎️ Stale-While-Revalidate (SWR) Optimization

- **`server-stale-while-revalidate/DateRevalidator.tsx`** → A utility that **simulates the stale-while-revalidate behavior** of **Tanstack Query**, but for **React Server Components**. It refreshes data when the user focuses on the page or at a set interval.
- **`server-stale-while-revalidate/debounce.ts`** → A debouncing utility to optimize refresh events and API calls.

**Example Use Case:**

- Auto-refreshing API data when users return to the page, just like SWR does for client-side data fetching.
- Preventing excessive re-fetching by debouncing calls and controlling revalidation frequency.

### 📦 Types

- **`types/response.ts`** → Standardized API response types, including **pagination structures** and success/error responses.

**Example Use Case:**

- Ensuring consistent API response structures across your application.

---

## 🎯 Why These Utilities?

- **Secure API handling** → Avoid exposing API keys and ensure authentication in API calls.
- **Better error management** → Handle API errors globally for a smoother UX.
- **Optimized data fetching** → Improve performance with SWR-like behaviors and debouncing.
- **Standardized responses** → Keep API responses structured and predictable.

These utilities are designed to make your **Next.js development more efficient and scalable**. Feel free to use, adapt, and integrate them into your projects! 🚀
