---
title: Impressionism
---

# Impressionist Palette Generator

Inspired by the Impressionist movement (Monet, Renoir, Pissarro) and Neo-Impressionism (Seurat, Signac).

## Overview

Impressionism revolutionized color by:

- **Broken color** - Separate brushstrokes that blend visually at distance
- **No black shadows** - Use blue/violet for shadows instead
- **Complementary juxtaposition** - Colors next to each other that intensify
- **Light-focused** - Capturing the quality of light at different times

## Usage

```typescript
import { impressionist } from "@skchr/color";

// Default: broken color technique
impressionist("green");
// ['#228b22', '#4169e1', '#daa520', '#dc143c', ...]

// Optical mixing style (pointillism)
impressionist("blue", { technique: "optical" });

// Morning light (soft, warm)
impressionist("yellow", { timeOfDay: "morning" });

// Noon light (bright, high saturation)
impressionist("white", { timeOfDay: "noon" });

// Dusk (purples, pinks)
impressionist("gray", { timeOfDay: "dusk" });
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `technique` | `'broken' \| 'optical'` | `'broken'` | Color application technique |
| `timeOfDay` | `'morning' \| 'noon' \| 'evening' \| 'dusk'` | `'noon'` | Quality of light |
| `blueShadows` | `boolean` | `true` | Use blue for shadows instead of black |
| `num` | `number` | `6` | Number of colors |

## Techniques

### Broken Color

Short, visible brushstrokes of pure color placed next to each other. When viewed from a distance, colors visually blend.

```typescript
impressionist("forest", { technique: "broken" });
// Returns palette with distinct color strokes
```

### Optical (Pointillism)

Based on Seurat and Signac's scientific approach. Uses RYB color wheel (not RGB) for color relationships.

```typescript
impressionist("sunset", { technique: "optical" });
// Returns palette based on RYB relationships
```

## Time of Day

### Morning

- Soft, warm light
- Yellows, oranges, pale blues
- Lower contrast

### Noon

- Bright, direct light
- High saturation
- Strong shadows (blue)

### Evening

- Golden hour warmth
- Oranges, purples, deep reds
- Warm undertones

### Dusk

- Fading light
- Purples, pinks, deep blues
- Cool temperature

## Examples

```typescript
// Monet's garden
impressionist("pink", {
  timeOfDay: "morning",
  blueShadows: true,
});

// River scene
impressionist("blue", {
  timeOfDay: "evening",
  technique: "broken",
});

// Seurat style
impressionist("green", {
  technique: "optical",
  num: 8,
});
```

## Color Theory

Key Impressionist principles:

1. **No black** - Shadows are colored, usually blue/violet
2. **Complementary neighbors** - Colors that intensify each other when adjacent
3. **RYB primary** - Traditional primaries (not RGB) for mixing
4. **Light > form** - Capturing the impression of light

Monet painted the same subject 25+ times to capture different light conditions.
