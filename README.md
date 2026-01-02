# Pokemon Felix

A modern Pokemon web application built with React + Vite, featuring a comprehensive Pokedex, battle system, and tournament mode.

## Features

- 🔍 **Pokemon Search**: Fuzzy search with autocomplete suggestions
- 📚 **Pokedex**: Browse and collect Pokemon with pagination
- ⭐ **Collection System**: Mark and track your favorite Pokemon
- ⚔️ **Battle Arena**: Simulate Pokemon battles with stat-based combat
- 🏆 **Tournament Mode**: 8-player elimination tournament
- 🌐 **Multilingual**: View Pokemon names and descriptions in multiple languages
- ♿ **Accessible**: Keyboard navigation and screen reader support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-felix
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file based on `.env.example`:
```bash
# Pokemon Felix

Pokemon Felix is a modern React + Vite web app that provides a Pokedex, collection system, battle arena, and tournament mode. This repository contains the frontend and a small mock backend (json-server) used for local development.

Quick links

- Project docs: `docs/README.md`
- Quick start: `docs/quick-start.md`
- Development guide: `docs/development.md`
- Contributing guide: `CONTRIBUTING.md`

Getting started (short)

1. Install dependencies:

```bash
npm install
```

2. Start local development (frontend + mock backend):

```bash
npm run dev
```

This will start the Vite frontend (default: http://localhost:5173) and `json-server` backend (http://localhost:3001) used for collection persistence.

Other useful scripts (see `package.json`):

- `npm run build` — build production assets
- `npm run preview` — preview a production build locally
- `npm run test` — run unit tests (`vitest`)
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

Where to go next

- For a quick development setup and common commands open `docs/quick-start.md`.
- For contribution guidelines and PR process open `CONTRIBUTING.md`.

Project structure (high-level)

```
pokemon-felix/
├── src/           # React source (components, features, hooks, contexts)
├── docs/          # Project documentation and guides
├── db.json        # Mock json-server database
├── package.json   # scripts, deps, dev-deps
└── README.md      # this file
```

If you'd like, I can expand the docs with architecture diagrams, code examples, or API references — tell me which area to prioritize.
- **`useCollection`**: Handles owned Pokemon collection
- **`usePokemonSearch`**: Fuzzy search with Fuse.js

### Context API

The app uses `PokemonContext` to provide global state, avoiding prop drilling and centralizing data management.

### API Integration

- **PokeAPI**: https://pokeapi.co - Pokemon data source
- **json-server**: Local backend for collection persistence

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Fuse.js** - Fuzzy search
- **json-server** - Mock REST API
- **Lucide React** - Icon library

## Features in Detail

### Pokemon Search
- Autocomplete with 10 suggestions
- Fuzzy matching for misspellings
- Debounced input for performance

### Battle System
- Stat-based damage calculation
- Turn-by-turn combat with animations
- Max turn limit (100) prevents infinite battles
- Health bar visualization with color coding

### Tournament Mode
- 8-player single-elimination bracket
- Automatic bracket progression
- Champion celebration screen

### Accessibility
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels and roles
- Focus indicators
- Screen reader support

## Environment Variables

Create a `.env` file to customize API endpoints:

```env
VITE_POKEMON_API_URL=https://pokeapi.co/api/v2
VITE_DB_URL=http://localhost:3001/collection
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes.

## Acknowledgments

- Pokemon data provided by [PokeAPI](https://pokeapi.co)
- Pokemon sprites from official artwork
- Built as a demonstration of modern React patterns
