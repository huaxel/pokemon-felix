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

````bash
# Pokemon Felix

Pokemon Felix is a modern React + Vite web app that provides a Pokedex, collection system, battle arena, and tournament mode. This repository contains the frontend and a small mock backend (json-server) used for local development.

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

### RPG Systems (Phases 2-7 Completed)
- Tile-based 10x10 world map navigation with quests
- Pokemon care, banking, and shopping features
- Educational modules (Python terminal, Math Potion Lab, Pokemon Academy Quiz)
- Dungeon & Exploring modes (cave puzzles, surfing, hiking)

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
````

## Quick Start & Developer Guides

- **Quick Start Guide**: [`docs/quick-start.md`](docs/quick-start.md) for local setup instructions.
- **Development Workflow**: [`docs/development.md`](docs/development.md) for code structure, UI conventions, testing, etc.
- **Architecture & System Logs**: [`docs/README.md`](docs/README.md) for deeper technical overviews.
- **Contributing Guidelines**: [`CONTRIBUTING.md`](CONTRIBUTING.md) to learn how to make Pull Requests.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

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
