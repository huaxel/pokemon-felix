# Data Layer

## Overview
The application uses a simulated REST API backbone powered by **JSON Server**.

### Source of Truth
During development, `db.json` at the project root acts as the database. It contains:
- `pokemon`: The player's captured Pokemon.
- `items`: Inventory items.
- `pokedex`: Static data about Pokemon species (implied).

## Data Access
Data access is abstracted through `src/lib/api.js`.

### Pattern
1. **Service Layer**: Functions in `api.js` handle HTTP requests (`fetch`).
2. **Context Integration**: Context providers call these services to fetch initial data or perform mutations (save, delete).
3. **Optimistic Updates**: Contexts often update local state immediately for UI responsiveness while syncing with the backend in the background.

## Future Considerations
- The `db.json` structure is intended to be easily replaceable with a real backend (Node.js/Express or Firebase) without changing the frontend service signatures.
