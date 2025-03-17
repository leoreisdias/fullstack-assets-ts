# 🪝 Custom React Hooks

Welcome to the hooks folder! Here you'll find a collection of **custom React hooks** that I've built and used throughout my projects. These hooks aim to **simplify** common patterns, improve **developer experience**, and make code **more reusable and maintainable**.

Feel free to **copy, modify, and adapt** them to your own needs. They are meant to be flexible and useful across different use cases. 😃

---

## 📌 Hooks

### `useFetch`

A **fully-typed helper** for **SWR**, designed to handle data fetching effortlessly. It includes **response formatters** and **typed query params** to ensure a smooth experience. There's also a version for **Tanstack Query**, which is more powerful but slightly more complex.

**Example Use Case:**

- Fetching user data from an API and displaying it with minimal setup.

### `useFetchInfinite`

An extended version of `useFetch`, but built around **SWRInfinite** for handling **infinite scrolling**. This hook is fully typed and works seamlessly with paginated data.

**Example Use Case:**

- Implementing an infinite scroll feature for a blog or product listing.

### `useHookFormError`

A helper for **React Hook Form** that **automatically retrieves validation errors** from standard fields, object fields, or field arrays. This makes handling form errors much cleaner and easier.

**Example Use Case:**

- Displaying validation messages in a multi-step form with nested fields.

### `useScrollBottom`

Triggers an action when the user **reaches the bottom of the screen**. Perfect for **loading more content dynamically** or **firing animations** when scrolling.

**Example Use Case:**

- Fetching additional API data when scrolling to the bottom of a page.

### `useHookFormReset`

Works alongside **React Hook Form** to **reset form state** after submission. This prevents unnecessary re-renders and simplifies managing form resets.

**Example Use Case:**

- Clearing a contact form after the user submits a message successfully.

### `useSelectOptions`

Fetches and manages **dropdown options** dynamically using **SWR or React Query**. This is useful when working with **remote API-driven select fields**.

**Example Use Case:**

- Populating a country selection dropdown with data fetched from an API.

### `useAutoFilter`

Automatically **syncs filters** with **URL query parameters**, allowing for **dynamic filtering** without manual state management. Ideal for search pages and data tables.
Depends on `useSearchParams` and Tanstack Table.

**Example Use Case:**

- Applying filters dynamically to a product list based on query params in the URL.

---

## 🎯 Why These Hooks?

- **Save development time** → Reuse well-tested hooks instead of writing custom logic from scratch.
- **Improve maintainability** → Keep UI logic clean and separate from business logic.
- **Enhance user experience** → Make forms, pagination, and API calls more efficient.

That's it! These hooks are designed to make your **React development smoother** and more **efficient**. Have fun using them! 🚀
