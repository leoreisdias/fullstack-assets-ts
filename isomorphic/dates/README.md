# 📅 Date Manipulation (`isomorphic/dates`)

This folder contains utilities for date manipulation that can be used in both **backend (NestJS)** and **frontend (Next.js)**.

## 📌 Contents:

- `calendar-handlers/` → Functions to structure months with **date-fns** and pure JS versions.
- `date-handlers/` → Functions for formatting dates, parsing, and basic date calculations.

## 🗓️ Calendar Handlers (`calendar-handlers/`)

These handlers help in structuring monthly calendars using **date-fns** as well as a pure JavaScript alternative.

### 🔹 Features:

- **Generate a month structure** → Creates an array of weeks and days, properly aligned based on the starting weekday.
- **Highlight special dates** → Supports marking events, holidays, or custom highlights.
- **Compatible with `date-fns`** → Uses `startOfMonth`, `endOfMonth`, `addDays`, etc., for easy manipulation.
- **Pure JS alternative** → Works without third-party dependencies for lightweight implementations.

### 🛠️ Example Usage:

```ts
import { generateMonthStructure } from "./calendar-handlers";

const month = generateMonthStructure(2025, 3); // April 2025
console.log(month);
```

### Use cases:

- **Calendar components** → Display monthly views with custom highlights.
- **Event schedulers** → Mark days with events or deadlines.
- **Date pickers** → Generate selectable date ranges for user input.

## ⏳ Date Handlers (`date-handlers/`)

This module provides helper functions for date formatting, parsing, and simple calculations.

### 🔹 Features:

- **Format without timezone issues** → Ensures consistent date output.
- **Parse and manipulate dates efficiently** → Works with different date formats.
- **Supports common operations** → Add/subtract days, compare dates, check if a date is in the past or future.

### 🛠️ Example Usage:

```ts
import { getDateAmericaSP } from "./date-handlers/timezone";

const today = getDateAmericaSP(); // Use the new function to get the date in the specified timezone

console.log(today);
```
