# Multi-View Project Tracker

A high-performance, responsive project management application built completely from scratch using React 19 and TypeScript. It implements a fully generic custom data architecture simulating 500+ tasks with real-time capabilities without relying on heavy third-party UI or component libraries.

## Key Features

- **Kanban Board**: Drag-and-drop task management built entirely natively using the `PointerEvent` API, including dynamic hover drop-zones, snap-back animations, and functional simulated drag clones.
- **List View**: Native robust multi-column data-grid with bidirectional sorting, inline status editing, and dynamic column alignment.
- **Virtual Scrolling Engine**: Hand-cranked DOM observer implementation (`useVirtualScroll.ts`) via React 18 `flushSync` handling huge 500+ arrays with completely fluid rendering scale and zero tearing.
- **Timeline / Gantt View**: Dynamically renders the current month's visual timeline with 1-to-N mapped task tracking bounds and absolute positioned 'Today' markers.
- **Real-Time Collaboration Simulator**: Simulates remote active teammates exploring tasks within seconds utilizing randomized algorithms and context overlapping stacking avatars.
- **State Architecture**: Relies purely on decoupled `useReducer` loops paired tightly with local Contexts to securely broadcast and manage massive JSON arrays globally, validating strictly to "No-Redux" demands.
- **Filters & URL Sync**: Bi-directional filter syncing straight into shareable bookmarkable query-parameters URL setups natively.
- **Performance Optimized**: Attains elite Lighthouse scoring via rigorous strict use of contextual bindings, `React.memo` wrapping loops, and callback pointers intercepting unneeded cascaded renders.

## Tech Stack
- Frontend: React 19, TypeScript
- Styling: Tailwind CSS v3
- Local Router: React Router DOM
- Custom Native Tooling: Zero third-party DnD, Virtual Scroll, Date parsing, or standard CSS UI library implementations.

## Running Locally

1. Clone repository
2. Install standard Node dependencies:
\`\`\`bash
npm install
\`\`\`
3. Startup generic Vite local server:
\`\`\`bash
npm run dev
\`\`\`
