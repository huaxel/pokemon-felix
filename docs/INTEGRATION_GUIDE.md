# Quick Start — Pokemon Felix

Minimal steps to run the project locally.

Prerequisites

- Node.js v16+ and npm

Install

```bash
npm install
```

Start development servers (frontend + mock backend)

```bash
npm run dev
```

- Frontend (Vite): http://localhost:5173
- Mock backend (json-server): http://localhost:3001

Notes

- The `dev` script runs `concurrently` to start both Vite and `json-server` (see `package.json`).
- The local database is `db.json`; changes are persisted while the server runs.

Build & Preview

```bash
npm run build
npm run preview
```

Running tests

```bash
npm run test
```

Formatting & linting

```bash
npm run format
npm run lint
```
