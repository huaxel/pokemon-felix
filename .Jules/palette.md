## 2025-05-24 - Custom SearchBar Accessibility

**Learning:** The custom `SearchBar` component lacked keyboard support and ARIA roles entirely, relying only on mouse clicks.
**Action:** Always verify keyboard operability (Arrow keys, Enter, Escape) for custom interactive components like dropdowns/autocompletes.

## 2025-05-24 - Toast Notifications Accessibility
**Learning:** The `ToastContainer` was implemented with plain `div`s and `onClick` handlers, making notifications inaccessible to keyboard users and lacking auto-dismissal.
**Action:** Use `role="alert"` (error) or `role="status"` (info), ensure keyboard dismissal (Enter/Space), and implement auto-dismissal with pause-on-hover.

## 2025-05-24 - Modal Accessibility and Keyboard Support
**Learning:** The `PokemonModal` component trapped users without keyboard focus management or an `aria-modal` context, making it unusable for screen readers and keyboard-only users.
**Action:** Always implement `role="dialog"`, `aria-modal="true"`, and handle `Escape` key for closure in modal components.
