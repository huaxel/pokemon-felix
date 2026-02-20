Implementation Plan
2 minutes ago

Review
Remaining Component Migrations - Implementation Plan
Goal
Complete the Kenney UI system integration by migrating all remaining components from modern glassmorphism to pixel-art aesthetic. Ensure consistency across the entire application.

Completed Work
✅ Phase 5: World Page Aesthetic Overhaul
Refactored WorldPage.css with Kenney panels
Migrated MovementControls, MapLegend, SeasonHUD
Removed modern glassmorphism from tiles
Fixed asset paths with absolute URLs

✅ Phase 7: Component Migrations (Completed)
✅ PokemonCard.css: Migrated to Kenney beige panels with fantasy borders
✅ CharacterCreationPage.css: Replaced glassmorphism with Kenney panels, updated inputs/buttons, removed border-radius
✅ SquadPage.css: Applied Kenney panel styling, updated cards and buttons
✅ Navbar.css: Replaced rounded pills with pixel-art borders, updated brand/nav items
✅ SearchBar.css: Replaced rounded input with Kenney border, updated button and suggestions
✅ GameConsole.css: Applied Kenney panel borders, updated screen area
✅ Border-Radius Audit: Removed border-radius from App.css, Toast.css, PokemonModal.css, WorldPage.css

Proposed Changes
(All proposed changes have been implemented)

Remove border-radius from all UI panels and containers
Keep minimal border-radius for circular icons/avatars where appropriate
Replace with Kenney borders or sharp pixel-art edges
Design System Expansion
New CSS Classes to Create
.game-button variants
.game-button {
/_ Base Kenney button _/
}
.game-button-primary {
/_ Blue active state _/
}
.game-button-secondary {
/_ Neutral/gray state _/
}
.game-button-success {
/_ Green confirmation _/
}
.game-button-danger {
/_ Red warning/delete _/
}
.game-input
.game-input {
/_ Kenney-styled text input _/
border: 3px solid var(--color-ui-border-brown);
background: rgba(255, 255, 255, 0.95);
padding: 0.75rem;
font-family: var(--header-font);
}
Verification Plan
Visual Testing
Navigate to each page and verify Kenney aesthetic
Test hover states on all buttons
Verify text contrast meets WCAG AA standards
Check responsive behavior on mobile
Functional Testing
Ensure all buttons remain clickable
Verify form inputs accept text correctly
Test navigation flow across pages
Confirm no visual regressions
Browser Testing
Chrome/Edge (Chromium)
Firefox
Safari (if available)
Responsive Optimization
Mobile Considerations
Reduce --border-slice-width on screens < 768px
Ensure buttons are touch-friendly (min 44px)
Test D-pad usability on mobile
Verify text remains readable
CSS Media Query
@media (max-width: 768px) {
:root {
--border-slice-width: 6px;
--border-slice-width-thick: 10px;
}
}
Timeline Estimate
CharacterCreationPage: 30 minutes
SquadPage: 30 minutes
Navbar: 20 minutes
SearchBar: 15 minutes
GameConsole: 25 minutes
Border-radius audit: 20 minutes
Button class creation: 30 minutes
Testing & verification: 45 minutes
Total: ~3.5 hours

Success Criteria
✅ All components use Kenney beige theme ✅ No border-radius on panels/containers ✅ All buttons use .btn-kenney variants ✅ Text contrast meets WCAG AA standards ✅ Consistent pixel-art aesthetic across app ✅ No visual or functional regressions
