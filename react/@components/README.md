# Components

Welcome to the components folder! Here you'll find a collection of reusable components that I've created and used throughout my career. These components are designed to be generic templates for future projects or for anyone interested in using them. The focus is on reusability, so feel free to adapt them to your specific business needs, styling, and so on. Think of it like Radix, but more personal and improvised. 😄

Below is a list of available components along with their purpose and use cases. They are designed to be flexible and easily adaptable to different projects.

## Components

### Advanced Filters

Advanced filters, as the name suggests, are designed to be integrated with the URL, similar to hook-form, to be shared and sent to the server. If you're using React Server Components (RSC), you could fetch the filters via searchParams and update your API call. If you're doing everything via Client like with Tanstack Query, just monitor the URL or get the data from the hook form. The idea is that the filter stores the options first in the hook-form and upon confirmation, sends them to the URL. But you could adapt it to prioritize the URL first and then the hook form, or not use the hook form at all and just use common inputs and update your API call through URL updates.

**Example Use Case:**

- Updating the URL first and upon clicking a button, sending the data to the API via Tanstack Query (client-side).
- Updating the URL with query params and monitoring it in an RSC, which updates the API call.
- Updating the URL and monitoring its changes client-side, applying the filters via client-side with Tanstack Table.

### Big Calendar

This is an example of a calendar-style agenda built from the calendar-handlers in the `/isomorphic/dates/calendar-handlers` folder. Since this helper provides a matrix structured in the form of a calendar, this component is a visual example based on that.

**Example Use Case:**

- Displaying a monthly calendar view with events fetched from an API.

### Hook Form Fields

These are form fields of various types, wrapped in a structure inspired by Shadcn, where there is a FormField, FormItem, FormControl, FormDescription, and FormMessage, but with styling from PandaCSS (Tailwind but css-in-js).

**Example Use Case:**

- Creating a user registration form with various input fields and validation messages.

### Motion Wrappers

An easy way to use PandaCSS with motion (the new framer-motion), so you have the properties of motion plus the declarative CSS freedom of JSX from PandaCSS.

**Example Use Case:**

- Animating a modal with smooth transitions and custom styling.

### PDF Visualizer

Uses react-pdf to display PDFs on the screen, but with different styling from the native browser, and an API to control pages, quantities, and more. This is a template, but it's amazing how customizable the PDF display can be here. Kudos to Wojciech Maj for this.

**Example Use Case:**

- Displaying a multi-page PDF document with custom navigation controls.

### Data Table

The Data Table component is a highly customizable and performant solution for displaying tabular data, built on top of the TanStack Table library. It offers a range of features designed to enhance usability and flexibility, making it suitable for various data presentation needs.

**Key Features:**

- **Declarative API:** The Data Table provides a declarative API for table configuration and state management, allowing for seamless integration with TanStack Table's powerful features.
- **Advanced Filtering:** Includes debounced updates for efficient filter application without excessive re-renders, utilizing a custom `debounce` utility.
- **Expandable Rows:** Supports expandable rows for displaying nested sub-rows, ideal for hierarchical data structures.
- **Column Resizing and Pinning:** Offers smooth column resizing and the ability to pin columns to the left or right, enhancing user experience.
- **Styling with PandaCSS:** Utilizes PandaCSS for consistent and maintainable styling, with composable sub-components for reusability.
- **Pagination Support:** Integrated pagination controls for navigating large datasets, with state management synchronized with the table.
- **Drag-to-Scroll:** Implements drag-to-scroll functionality in the `<tbody>` section, enhancing user experience when dealing with wide tables.
- **Smooth Animations:** Uses the `motion/react` library for row transition animations, providing visual feedback when adding or removing rows.
- **Headless Components:** Provides headless table components inspired by Radix UI design, allowing for high customization while maintaining accessibility.
- **useDataTable Hook:** Includes a utility hook for managing table state and applying filters programmatically with built-in debounce.

**Example Use Case:**

- Displaying a large dataset with features like filtering, pagination, and expandable rows for detailed views.
- Implementing tables with hierarchical data that can be expanded to show additional details.
- Creating admin interfaces with responsive tables that support sorting, filtering, and pagination.

**Advanced Insights:**

- **Performance Optimizations:** The component employs memoization, debouncing, and efficient rendering techniques to ensure high performance even with large datasets.
- **Accessibility Considerations:** Developers are encouraged to add ARIA attributes and keyboard navigation support to improve accessibility for users with assistive technologies.
- **Modular Architecture:** The component is divided into specialized subcomponents (DataTable, ExpanderCell, Pagination) that can be used independently or composed together.
- **Library Integration:** Beyond TanStack Table, the component integrates with PandaCSS for styling, motion/react for animations, and uses Phosphor Icons for visual elements.
- **Rendering Optimization:** Implements conditional rendering based on resizing state and uses `AnimatePresence` for smooth transitions between table states.
- **Efficient State Management:** Utilizes hooks like `useCallback`, `useMemo`, and `useImperativeHandle` to manage stable references and expose the table API declaratively.

For more technical details, refer to the [TanStack Table Documentation](https://tanstack.com/table/v8/docs/guide/introduction).
That's it! This is a summary and a bit of the philosophy with some examples and such. Feel free to have fun with these components and make them your own!
