---
title: Artist-Inspired Palettes
---

# Artist-Inspired Palettes

Color includes palette generators inspired by famous artists and art movements.

## Available Generators

| Generator | Artist/Movement | Description |
| --------- | ---------------- | ----------- |
| [`vangogh()`](./vangogh.md) | Vincent van Gogh | Palettes inspired by van Gogh's distinctive use of vibrant yellows, deep blues, and complementary contrast |
| [`impressionist()`](./impressionism.md) | Impressionism | Palettes inspired by Monet, Renoir using broken color technique and optical mixing |
| [`picasso()`](./picasso.md) | Pablo Picasso | Palettes from Blue Period (melancholic blues) and Rose Period (warm pinks) |

## Usage

```typescript
import { vangogh, impressionist, picasso } from "@skchr/color";

// Van Gogh inspired palette
vangogh("yellow", { period: "arles" });

// Impressionist palette
impressionist("green", { timeOfDay: "morning" });

// Picasso Blue Period
picasso("blue", { period: "blue" });
```

## Concepts

These generators are based on:

- **Color theory** - How artists used complementary colors
- **Historical palettes** - Pigments available to artists
- **Emotional symbolism** - Colors that convey specific moods
- **Artistic techniques** - Brushstrokes, layering, optical mixing
