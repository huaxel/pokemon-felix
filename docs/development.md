# Development Guide — Pokemon Felix

Developer checklist and conventions.

Local setup

1. Install dependencies:

```bash
npm install
```

2. Start development servers (frontend + mock backend):

```bash
npm run dev
```

Dev workflow

- Work on feature branches named `feature/<short-description>`.
- Keep commits small and focused; run lint and format before pushing.

Testing

- Unit tests: `npm run test` (Vitest + jsdom). Put unit tests next to the code or in `__tests__`.
- Run single tests during development via `vitest -u` or using test matchers.

Linting & formatting

- `npm run lint` — check style
- `npm run lint:fix` — auto-fix lintable issues
- `npm run format` — Prettier across the repo

Code structure (quick reference)

- `src/components` — small reusable UI components
- `src/features` — grouped feature modules (battle, tournament, gacha, profile)
- `src/hooks` — domain-specific hooks (data, search, collection)
- `src/contexts` — global state providers
- `src/lib` — utilities and complex business logic (battle calculations, api clients)

Adding a new feature — quick steps

1. Create a folder `src/features/<feature-name>` and add components and hooks there.
2. Add tests and basic story/examples where appropriate.
3. Register routes and add a navigation entry when the feature is user-facing.
4. Add a short doc under `docs/` and link it from `docs/features.md`.

PR & review checklist

- Describe what the change does and why.
- Include manual verification steps and screenshots if UI changed.
- Ensure tests pass and linting is clean.

Need more?

If you want a step-by-step contributor onboarding or a CI checklist (GitHub Actions), I can add them here.
