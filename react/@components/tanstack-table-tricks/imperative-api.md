# 📚 Exposing TanStack Table API Imperatively

## Why do this?

Sometimes you need to control the table from outside the component.  
Example: applying filters from external inputs, forcing a reset, or triggering actions programmatically.

React does not allow this naturally with functions — but it does through `ref`.

**`useImperativeHandle`** lets you expose custom methods from your component to the parent.

---

## 🛠️ How to expose the table control

Inside your table wrapper (e.g., `<DataTable />`), use:

```tsx
useImperativeHandle(
  ref,
  () => ({
    getTable: () => table,
  }),
  [table]
);
```

- `ref` is passed from the parent.
- `getTable` returns the TanStack Table instance.
- `[table]` dependency ensures the reference updates correctly if the table instance changes.

---

## 🧩 Creating a helper hook — `useDataTable`

This hook centralizes setup for consumers:

```tsx
export function useDataTable<T = any>() {
  const ref = useRef<DataTableRef | null>(null);

  const handleFilterChange = useCallback((columnId: keyof T, value: any) => {
    const table = ref.current?.getTable<T>();
    table?.getColumn(columnId as string)?.setFilterValue(value);
  }, []);

  const debouncedOnChange = useMemo(
    () => debounce(handleFilterChange, 600),
    [handleFilterChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return {
    ref,
    table: ref.current?.getTable<T>(),
    applyFilter: debouncedOnChange,
  };
}
```

**Explanation:**

- `ref` is passed into your `DataTable`.
- `handleFilterChange` locates the column and sets its filter value.
- `debouncedOnChange` delays the execution for better performance when typing.
- `useEffect` ensures the debounce is canceled on component unmount.

---

## ⚡ Technical Insights

### About Performance:

- **Debounce**: prevents excessive re-filtering while the user types.
- **useCallback**: keeps the `handleFilterChange` function stable between renders. Without it, a new function reference would be created every time, making `useMemo`'s dependency array ineffective.
- **useMemo**: ensures the `debouncedOnChange` function is only recreated when the stable `handleFilterChange` changes. Together with `useCallback`, it avoids unnecessary re-debouncing on every render.

Both are critical here: `useCallback` stabilizes the function, and `useMemo` stabilizes the debounced version of that function.

### About Developer Experience (DX):

- Enables external filters or actions without polluting the table component itself.
- Allows flexible composition with decoupled UI.
- Makes table integration smoother and easier to maintain.

---

## 📌 Practical Summary

- `useImperativeHandle` is used to expose a manual API from your component.
- Exposing the TanStack Table via `ref` gives powerful external interaction capabilities.
- `useDataTable` makes table access and filtering reusable and clean.
- Always cancel debounced functions to prevent memory leaks.

---

If needed, a more advanced version could refine typings and provide safer column handling.
