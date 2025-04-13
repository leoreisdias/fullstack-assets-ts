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

That's it! This is a summary and a bit of the philosophy with some examples and such. Feel free to have fun with these components and make them your own!
