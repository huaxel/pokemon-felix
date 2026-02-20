CSS Architecture Refactor - Kenney Asset Integration
Phase 1: Audit & Index
Identify CSS file locations (56 files found)
Create Kenney UI design token system
Configure global pixel-perfect rendering
Migrate generic components to Kenney panels
PokemonModal
PokemonCard
CharacterCreationPage
SquadPage panels
Implement reusable .game-button class
Verify accessibility compliance for new components
Update
index.css
with comprehensive pixel-perfect rendering rules
Add vendor prefixes for image-rendering (pixelated, crisp-edges)
Apply to html, body, canvas, and all image elements
Step B: Design Tokens
Extract primary colors from Kenney UI assets
Define CSS variables for UI backgrounds, borders, active states
Create color tokens at :root level
Document color usage guidelines
Set line-height to 1.5 for RPG dialogue legibility
Ensure WCAG AA contrast compliance
Phase 3: Component Implementation
Create .game-panel utility class with 9-slice border-image
Implement dialogue box with Kenney panel assets
Verify text contrast (WCAG AA) against panel backgrounds
Create reusable UI component classes
Phase 3: UI Expansion
Migrate
PokemonCard.css
to Kenney panel style
Create game-button class in
game-ui.css
Apply Kenney styling to CharacterCreationPage.css
Audit remaining border-radius usage
Phase 4: Verification
Visual inspection in running dev server
Test pixel-perfect rendering across browsers
Verify contrast ratios
Document new CSS architecture
Phase 5: World Page Aesthetic Overhaul
Refactor
WorldPage.css
to use Kenney panels and tokens
Migrate
MovementControls
to Kenney D-pad style
Update
MapLegend
with RPG dialogue theme
Refactor
SeasonHUD
for Kenney compatibility
Clean up map tile CSS (remove modern glassmorphism)
Phase 6: Polish & Mobile Optimization
Implement responsive --border-slice-width
Final visual audit across all pages
Update walkthrough with final showcase
Phase 7: Remaining Component Migrations
Migrate
PokemonCard.css
to Kenney panel style
Apply Kenney styling to CharacterCreationPage.css
Update SquadPage panels to Kenney theme
Audit and replace remaining border-radius usage
Create .game-button class variants
