## 2025-05-24 - Custom SearchBar Accessibility

**Learning:** The custom `SearchBar` component lacked keyboard support and ARIA roles entirely, relying only on mouse clicks.
**Action:** Always verify keyboard operability (Arrow keys, Enter, Escape) for custom interactive components like dropdowns/autocompletes.

## 2025-05-24 - Toast Notifications Accessibility
**Learning:** The `ToastContainer` was implemented with plain `div`s and `onClick` handlers, making notifications inaccessible to keyboard users and lacking auto-dismissal.
**Action:** Use `role="alert"` (error) or `role="status"` (info), ensure keyboard dismissal (Enter/Space), and implement auto-dismissal with pause-on-hover.
## 2026-02-28 - Game Console Accessibility
**Learning:** The `GameConsole` component was functioning as a modal dialog but lacked the necessary `role="dialog"` and `aria-modal="true"` attributes, making it inaccessible to screen readers. It also lacked a label.
**Action:** Add `role="dialog"` and `aria-modal="true"` to custom modal components, and properly link their title using `aria-labelledby` to improve accessibility.
