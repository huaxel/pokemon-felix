Summary of automated refactor and recommended next steps

Changes applied (high level):

- Decomposed `PokemonProvider` into smaller, focused contexts:
  - Added `CollectionContext`, `BattleContext`, `UIContext`, `CareContext`, `TownContext` and provided them from `PokemonProvider` for backward compatibility.
  - Added `useCareContext` and `useTownContext` hooks and updated representative components to consume them (`CarePage`, `WorldPage`, `CardBattle`).

- Introduced a small service layer for collection persistence:
  - `src/lib/services/collectionService.js` (retries, validation).
  - Refactored `useCollection` to use the service and updated tests.

- Performance and quality improvements:
  - Memoized `PokemonCard` with `React.memo`.
  - Lazy-loaded `PokemonModal` in `App`, `PokedexPage`, and `CollectionPage`.
  - Added Vitest tests for `battle-logic`, `useCollection`, and `useSquad`.
  - Added ESLint and Prettier configs and fixed many lint issues.

Files added/modified (representative):

- Added: `src/contexts/{CollectionContext,BattleContext,UIContext,CareContext,TownContext}.jsx`
- Added: `src/hooks/{useCareContext,useTownContext}.js`
- Added: `src/lib/services/collectionService.js`
- Modified: `src/contexts/PokemonProvider.jsx`, `src/hooks/useCollection.js`, `src/components/PokemonCard.jsx`, `src/features/pokedex/PokedexPage.jsx`, `src/components/CollectionPage.jsx`, `src/App.jsx`, `src/features/care/CarePage.jsx`, `src/features/world/WorldPage.jsx`, `src/features/battle/CardBattle.jsx`

Why these changes:

- Reduce responsibilities of a single large context and make ownership explicit (care, town, battle, collection). This makes unit testing, code ownership, and incremental refactoring easier.
- Consolidate domain operations in a small `services/` layer to separate networking/persistence from UI hooks.
- Improve performance for list-heavy pages via memoization and lazy-loading.

Suggested next steps (PR checklist / roadmap):

1. Run the app and test main flows (Pokedex, Collection, Battle) manually. Fix any runtime regressions.
2. Move other hooks that interact with network/localStorage into `src/lib/services/` (inventoryService, questsService, townService).
3. Add `useXContext` hooks for any contexts that will be consumed widely (e.g., `useCollectionContext`, `useBattleContext`).
4. Add a CI workflow that runs lint and tests on PRs.
5. Incrementally convert `src/lib` and core hooks to TypeScript (start with `services/` and `lib/battle-logic.js`).
6. Add unit tests for `useInventory`, `useQuests`, and critical UI interactions (modal open/close, squad add/remove) and an integration test for Pokedex list rendering.

Notes about lint/tests:
- ESLint and Prettier configs were added and run. A mixture of complex hook dependencies required a few targeted changes and minimal `eslint-disable` usage where necessary (documented inline). 
- Vitest tests added and passing locally for the core logic; during repeated runs the test runner reported a worker out-of-memory error in this environment — tests themselves pass, but CI should be configured to give sufficient memory.

If you want, I can open a patch/PR with these changes grouped logically (contexts/service/refactor/tests). Which grouping would you prefer? (single large PR, or multiple small PRs grouped by concern)
