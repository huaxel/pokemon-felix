# Asset Credits & Documentation

This project uses assets from **Kenney.nl** (Kenney Vleugels), released under the **CC0 1.0 Universal** license (Public Domain).

## Used Asset Packs

### 1. Kenney Tiny Town
- **Path**: `/src/assets/kenney_tiny-town`
- **Usage**:
  - World map tiles (grass, water, paths, buildings)
  - Character sprites
  - Environmental objects (trees, rocks)
- **License**: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

### 2. Kenney RPG Urban Pack
- **Path**: `/src/assets/kenney_rpg-urban-pack`
- **Usage**:
  - City buildings (Gym, Market, Pokemon Center)
  - Urban tiles (roads, sidewalks)
  - Specialized characters
- **License**: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

### 3. Kenney Fantasy UI Borders
- **Path**: `/src/assets/kenney_fantasy-ui-borders`
- **Usage**:
  - UI panels (9-slice borders)
  - Buttons (`btn-kenney`)
  - Modal backgrounds
- **License**: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

### 4. Kenney Roguelike Characters
- **Path**: `/src/assets/kenney_roguelike-characters`
- **Usage**:
  - Player characters
  - NPCs
- **License**: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

## Integration Guidelines

### Style Consistency
- **Pixel Art**: All visual elements should use `image-rendering: pixelated` in CSS.
- **Font**: Use `"Press Start 2P"` for all headers and game text.
- **UI Components**: Use `.btn-kenney`, `.game-panel`, and `.game-panel-dark` classes.
- **Backgrounds**: Use centralized `grassTile` from `worldAssets.js` for page backgrounds.

### Adding New Assets
1. Download the pack from [Kenney.nl](https://kenney.nl/assets).
2. Place in `src/assets/kenney_[pack-name]`.
3. Add export to `src/features/world/worldAssets.js` if it's a shared world asset or item.
4. Update this documentation.

## Special Thanks
Thanks to Kenney for providing these high-quality assets for free!
