---
title: Picasso
---

# Picasso Palette Generator

Inspired by Pablo Picasso's artistic periods, focusing on his Blue and Rose periods.

## Overview

Picasso's early work is characterized by dramatic color shifts that reflect his emotional state:

- **Blue Period (1901-1904)** - Melancholic blues, themes of poverty and loneliness
- **Rose Period (1904-1906)** - Warmer pinks, oranges, circus performers

## Usage

```typescript
import { picasso } from "@skchr/color";

// Default: Blue Period
picasso("blue");
// ['#0a0a2e', '#1a1a4e', '#2d2d6e', '#4a4a8e', '#6b6bad', ...]

// Explicit Blue Period
picasso("blue", { period: "blue" });
// Returns varying shades of blue

// Rose Period
picasso("pink", { period: "rose" });
// ['#ffcccb', '#ffb6a3', '#ffa07a', '#ff8c69', '#cd5c5c', ...]

// Adjust melancholy intensity (Blue Period)
picasso("blue", { period: "blue", intensity: 0.8 });
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `period` | `'blue' \| 'rose'` | `'blue'` | Artistic period |
| `intensity` | `number` | `0.5` | Emotional intensity (0-1) |
| `num` | `number` | `6` | Number of colors |

## Blue Period

Characterized by:

- Shades of blue and blue-green
- Occasional sienna touches (warmth breaking through)
- Low saturation
- Themes of poverty, loneliness, blindness

```typescript
// Typical Blue Period palette
picasso("blue", { period: "blue", intensity: 0.5 });
// ['#1a237e', '#283593', '#303f9f', '#3949ab', '#3f51b5', '#5c6bc0']

// High melancholy
picasso("blue", { period: "blue", intensity: 0.9 });
// ['#000051', '#000077', '#00009e', '#0000c7', '#1a1a4e', '#262680']
```

The intensity affects:

- Darkness of blues
- Saturation (lower = more muted)
- Presence of warm accents

## Rose Period

Characterized by:

- Pinks, oranges, coral
- Warm earth tones
- Flesh tones
- Circus/performer subjects

```typescript
// Rose Period palette
picasso("rose", { period: "rose" });
// ['#ffcccb', '#ffb6a3', '#ffa07a', '#ff7f50', '#cd5c5c', '#b22222']

// Warm shift
picasso("orange", { period: "rose" });
// ['#ffe4b5', '#ffdab9', '#ffc0cb', '#ffb6c1', '#fa8072', '#e9967a']
```

## Examples

```typescript
// The Old Guitarist (1903) inspired
picasso("blue", {
  period: "blue",
  intensity: 0.8,
  num: 5
});

// Transition palette (Blue to Rose)
const transition = [
  ...picasso("blue", { period: "blue", num: 3 }),
  ...picasso("rose", { period: "rose", num: 3 })
];
```
