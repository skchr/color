---
title: Van Gogh
---

# Van Gogh Palette Generator

Inspired by Vincent van Gogh's distinctive color palette, particularly from his Arles period (1888-1889).

## Overview

Van Gogh's work is characterized by:

- **Vibrant yellows** - Chrome yellow, cadmium yellow (sunflowers, wheat fields)
- **Deep blues** - Ultramarine, cobalt blue (night sky, cypresses)
- **Complementary contrast** - Yellow/orange paired with blue
- **Emotional intensity** - Colors that express feeling rather than represent reality

## Usage

```typescript
import { vangogh } from "@skchr/color";

// Default: Arles period with bold contrast
vangogh("yellow");
// ['#ffd700', '#ffb347', '#87ceeb', '#1e3a5f', '#0d1b2a', ...]

// Netherlands period (darker, muted)
vangogh("blue", { period: "netherlands" });
// ['#2d2d2d', '#4a4a4a', '#1a237e', '#0d47a1', ...]

// Paris period (lighter, more saturated)
vangogh("green", { period: "paris" });

// With subtle contrast
vangogh("orange", { contrast: "subtle" });
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `'netherlands' \| 'paris' \| 'arles'` | `'arles'` | Artistic period |
| `contrast` | `'subtle' \| 'medium' \| 'bold'` | `'bold'` | Complementary contrast intensity |
| `num` | `number` | `6` | Number of colors in palette |

## Periods

### Netherlands (1883-1886)

Dark, muted colors. Early work before moving to Paris.

- Muted browns, dark greens
- Limited saturation

### Paris (1886-1888)

Lighter, more saturated colors. Influence of Impressionism.

- Brighter primaries
- More varied hues

### Arles (1888-1889)

The most recognizable Van Gogh style.

- Intense yellows and oranges
- Deep blues and purples
- High contrast complementary pairs

## Examples

```typescript
// Wheat field palette
vangogh("#daa520", { period: "arles", contrast: "bold" });

// Starry night palette
vangogh("#1e3a5f", { period: "arles", contrast: "bold" });

// Sunflowers palette
vangogh("#ffd700", { period: "arles", num: 8 });
```

## Color Theory

Van Gogh used complementary colors (opposites on the color wheel) to create visual tension and energy:

- Yellow ↔ Blue/Violet
- Orange ↔ Blue
- Red ↔ Green

He wrote: "Looking at the stars always makes me dream... Why, I ask myself, shouldn't the shining dots of the sky be as accessible as the black dots on the map of France?"
