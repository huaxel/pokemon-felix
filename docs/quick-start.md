# Quick Start Guide - Pokemon Felix

Welcome to Pokemon Felix! This guide will help you get the project running locally on your machine in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher recommended)
- npm (comes with Node.js) or yarn
- Git

## Setup Instructions

1. **Clone the repository**

If you haven't already, clone the project repository to your local machine:

```bash
git clone <repository-url>
cd pokemon-felix
```

2. **Install Dependencies**

Install all required frontend and backend dependencies using npm:

```bash
npm install
```

3. **Start the Development Servers**

Pokemon Felix requires two servers to run locally:

- Vite development server (for the React frontend)
- json-server (for the mock backend data storage)

We use `concurrently` to run both with a single command:

```bash
npm run dev
```

This will automatically start:

- The React application at `http://localhost:5173`
- The json-server backend at `http://localhost:3001`

**Note:** If you get an error that the ports are already in use, make sure you don't have another instance of the application or server running in the background.

## Next Steps

Once the application is running, open your browser and navigate to `http://localhost:5173` to view the game.

For more detailed information on the project structure, development workflows, and testing, please refer to the [Development Guide](./development.md).

For contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
