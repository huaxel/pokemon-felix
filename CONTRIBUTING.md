# Contributing to Pokemon Felix

Thanks for considering contributing! A few simple guidelines make reviews faster and help maintain quality.

Getting started

1. Fork the repository and create a branch: `git checkout -b feature/short-description`.
2. Keep changes small and focused.
3. Run tests and lint locally before opening a PR:

```bash
npm install
npm run test
npm run lint
```

Commit messages

- Use imperative messages: "Add feature X" not "Added feature X".

Branch naming

- `feature/<name>` for new features
- `fix/<name>` for bugfixes
- `chore/<name>` for maintenance

Pull requests

- Describe the change, why it is needed, and how to test it.
- Link related issues if applicable.
- Keep PRs reviewable; split large work into smaller PRs when possible.

Code style

- Follow existing patterns in the codebase.
- Run `npm run format` and `npm run lint:fix` before committing.

Thank you!
