# UI/UX Architecture

## Component Strategy

The project follows a feature-based component structure rather than a strict Atomic Design methodology.

- `src/components/`: Shared, reusable UI elements (Buttons, Cards, Modals).
- `src/features/`: Complex, domain-specific views and their sub-components (e.g., Battle interface, Pokedex view).

## Styling System

- **Approach**: Standard CSS with CSS Variables.
- **Theming**: Defined in `src/index.css` using `:root` variables for colors (`--primary-color`, `--secondary-color`) and fonts.
- **Responsive Design**: Implemented via standard CSS `@media` queries.
- **Fonts**: 'Inter' for UI text, 'Luckiest Guy' for headers.

## Routing

- **Library**: React Router (v7).
- **Structure**: Defined in `App.jsx`.
- **Navigation**: Managed via `Link` components and programmatic navigation hooks.

## Key UI Libraries

- **Lucide React**: For consistent iconography.
- **@dnd-kit**: For drag-and-drop interactions (likely used in Party management or PC box organization).
