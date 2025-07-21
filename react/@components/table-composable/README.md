# TanStack Table Tricks: Composable vs. Smart Tables

This directory contains two distinct approaches to building tables with TanStack Table: a basic, style-focused composable table (`TableBase`) and a more intelligent, feature-rich composable table (`SmartTable`).

## Motivation

In many projects, we often need tables with varying appearances and animations, but we want to retain the powerful logic provided by TanStack Table (e.g., `useReactTable`, `row.getVisibleCells`, etc.) without constantly copying and pasting boilerplate code.

The initial approach involved a single `DataTable` wrapper that handled both styling and logic. However, this led to limitations when trying to apply specific styles to individual parts of the table without relying on `innerStyle` props, which can become cumbersome and hard to maintain.

Inspired by composable UI patterns (like ArkUI's `Dialog.Root`, `Dialog.Header`, etc.), the goal was to create a more granular and flexible table component system. This allows for applying styles and behaviors to specific parts of the table (e.g., `Table.Body`, `Table.Row`, `Table.Cell`) while still benefiting from the pre-applied logic via React Context.

The challenge was to balance composability, granularity, and maintainability, especially with features like column resizing (which requires memoization) and row animations. This led to the development of two distinct table components: `TableBase` for pure styling and `SmartTable` for intelligent, feature-rich composability.

### Important Considerations (Applies to both `TableBase` and `SmartTable`)

1.  **CSS Engine (PandaCSS):** The current implementation uses PandaCSS for styling. Developers integrating these components into their projects will need to adapt the styling to their chosen CSS engine (e.g., Tailwind CSS, Styled Components, Emotion, etc.). This typically involves replacing PandaCSS-specific syntax with the equivalent in your preferred styling solution.

2.  **Copy-and-Paste Adaptability:** These components are designed with a "copy-and-paste" philosophy. This means they are highly adaptable to specific project needs. If certain logic (e.g., advanced resizing features, specific animations) is not required for a particular use case, it is recommended to remove that code to reduce bundle size and simplify maintenance.

3.  **Ongoing Refinement:** While functional, the current version of these components is subject to ongoing refinement. As new project requirements emerge, existing logic may be improved, new props may be added, and interactions may be enhanced. This documentation will be updated accordingly to reflect these continuous improvements.

## `TableBase`: The Basic, Style-Focused Composable Table

`TableBase` is designed to be a headless, styled table component. It provides the fundamental HTML structure for a table (`<table>`, `<thead>`, `<tbody>`, etc.) with pre-defined styling recipes. It does **not** include any TanStack Table logic or state management.

**Use Case:**

- When you need a simple, styled HTML table without any advanced features like sorting, filtering, or pagination.
- When you want to build a custom table from scratch and manage all logic externally.

**Location:**
`@/react/@components/tanstack-table-tricks/table-basic.tsx`

**Example Usage:**

```tsx
import { TableBase } from "@/react/@components/tanstack-table-tricks/table-basic";

const MyBasicTable = () => (
  <TableBase.Root>
    <TableBase.Header>
      <TableBase.Row>
        <TableBase.Head>Name</TableBase.Head>
        <TableBase.Head>Age</TableBase.Head>
      </TableBase.Row>
    </TableBase.Header>
    <TableBase.Body>
      <TableBase.Row>
        <TableBase.Cell>John Doe</TableBase.Cell>
        <TableBase.Cell>30</TableBase.Cell>
      </TableBase.Row>
    </TableBase.Body>
  </TableBase.Root>
);
```

## `SmartTable`: The Intelligent, Feature-Rich Composable Table

`SmartTable` is the core of the intelligent table system. It leverages React Context to provide TanStack Table's powerful logic (sorting, filtering, pagination, resizing, column pinning, animations, etc.) to its composable sub-components. This allows you to build highly customized tables with granular control over styling and behavior, without duplicating TanStack Table boilerplate.

**Key Features:**

- **Context-driven Logic:** All TanStack Table logic is managed internally and exposed via context.
- **Composable API:** Build tables using `SmartTable.Provider`, `SmartTable.Root`, `SmartTable.Header`, `SmartTable.Body`, `SmartTable.Row`, `SmartTable.Cell`, and `SmartTable.Pagination`.
- **Automatic Memoization:** Handles memoization for performance-critical operations like column resizing.
- **Row Animations:** Integrates with `motion/react` for smooth row animations.
- **Column Pinning & Resizing:** Full support for advanced column features.
- **Stripped Rows:** Easy styling for alternating row backgrounds.
- **TanStack Table Feature Coverage:** `SmartTable` does not include 100% of all TanStack Table functionalities. However, due to its composable and adaptable nature, additional features can be incrementally added as needed. Developers are encouraged to extend the `SmartTable` components with more TanStack Table logic as their project demands evolve. I also plan to implement other logic as needed in projects I'm using, and then update it here.

**Use Case:**

- When you need a powerful, customizable table with all the features of TanStack Table.
- When you want to apply specific styles or behaviors to individual table parts (e.g., a custom header, animated rows, or unique cell rendering) while retaining the underlying data logic.
- When you want to avoid repeating TanStack Table boilerplate in every table instance.

**Location:**
`@/react/@components/tanstack-table-tricks/smart-table/index.tsx`

**Example Usage:**

```tsx
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { SmartTable } from "@/react/@components/tanstack-table-tricks/smart-table";
import { useDataTable } from "@/react/@components/tanstack-table-tricks/smart-table/parts/hooks"; // Custom hook for TanStack logic

const MySmartTable = ({ data, columns }) => {
  const table = useDataTable({ data, columns }); // Custom hook to encapsulate TanStack logic

  return (
    <SmartTable.Provider table={table}>
      <SmartTable.Root border="none" fontSize="sm">
        <SmartTable.Header>
          {(headerGroups) =>
            headerGroups.map((headerGroup) => (
              <SmartTable.HeaderRow
                key={headerGroup.id}
                headers={headerGroup.headers}
                bg="transparent"
                fontSize="sm"
              />
            ))
          }
        </SmartTable.Header>
        <SmartTable.Body stripped animateRows />
      </SmartTable.Root>
      <SmartTable.Pagination />
    </SmartTable.Provider>
  );
};

// Example with custom row rendering from render prop
const MySmartTableWithCustomRows = ({ data, columns }) => {
  const table = useDataTable({ data, columns });

  return (
    <SmartTable.Provider table={table}>
      <SmartTable.Root>
        <SmartTable.Header />
        <SmartTable.Body>
          {(rows) =>
            rows.map((row) => (
              <SmartTable.Row key={row.id} row={row} stripped>
                <SmartTable.Cell key={cell.id} cell={cell} bg="red" />
              </SmartTable.Row>
            ))
          }
        </SmartTable.Body>
      </SmartTable.Root>
    </SmartTable.Provider>
  );
};

// Example with custom row rendering from table API
const MySmartTableWithCustomRows = ({ data, columns }) => {
  const table = useDataTable({ data, columns });

  return (
    <SmartTable.Provider table={table}>
      <SmartTable.Root>
        <SmartTable.Header />
        <SmartTable.Body>
          {table.getRowModel().rows.map((row) => (
            <SmartTable.Row key={row.id} row={row} stripped>
              {row.getVisibleCells().map((cell) => (
                <SmartTable.Cell key={cell.id} cell={cell}>
                  {/* Custom cell rendering */}
                  {cell.column.id === "name" ? (
                    <strong>{cell.getValue()}</strong>
                  ) : (
                    cell.getValue()
                  )}
                </SmartTable.Cell>
              ))}
            </SmartTable.Row>
          ))}
        </SmartTable.Body>
      </SmartTable.Root>
    </SmartTable.Provider>
  );
};
```
