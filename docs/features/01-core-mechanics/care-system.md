# Care System

## Overview

The Care System mimics the responsibilities of a pet owner. It is the primary way to restore a Pokemon's Energy and improve their Mood.

## Stats

- **Hunger**: Increases over time or after battles. Affects HP recovery.
- **Dirtiness**: Increases after battles or training. Lowers Mood.
- **Affection**: Long-term stat. Unlocks special interactions and evolution.

## Actions

1. **Feed**: Give Berries or Poffins. restores Saturation.
2. **Brush/Wash**: Removes Dirtiness. Improves Mood.
3. **Pet**: Small Affection boost.

## Code Reference

- **Hook**: `useCareSystem` (custom hook).
- **Context**: `CareContext` (provides global tick listeners for stat decay).
