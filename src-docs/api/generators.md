---
title: Generators
---

# Generators

Palette generators create color palettes from a starting color.

## hueshift

Creates a palette where hue shifts as lightness changes.

```typescript
import { hueshift } from "@skchr/color";

hueshift("#3e0000");
// ['#ffffe1', '#ffdca5', '#ca9a70', '#935c40', '#5c2418', '#3e0000', ...]
```

**Options:**

- `num` - Number of samples (default: 6)
- `hueStep` - Hue angle step (default: 5)
- `minLightness` - Minimum lightness (default: 5)
- `maxLightness` - Maximum lightness (default: 90)

## earthtone

Creates a palette between an earth tone and a color.

```typescript
import { earthtone } from "@skchr/color";

earthtone("pink", { earthtones: "clay" });
// ['#6a5c52', '#8d746a', '#b38d86', '#d9a6a6', '#ffc0cb']
```

**Earth tone options:**

- `light-gray`, `silver`, `sand`, `tupe`
- `mahogany`, `brick-red`, `clay`, `cocoa`
- `dark-brown`, `dark`

## pastel

Generates a random pastel variant.

```typescript
import { pastel } from "@skchr/color";

pastel("green"); // ['#a8d8a8', '#b8e0b0', '#c8e8c0', ...]
```

## scheme

Creates classic color schemes.

```typescript
import { scheme } from "@skchr/color";

scheme("blue", { kind: "triadic" });
// ['#0000ff', '#00ff00', '#ff0000']

scheme("blue", { kind: "complementary" });
// ['#0000ff', '#ffff00']
```

**Scheme types:**

- `analogous` - Adjacent colors
- `triadic` - Three evenly spaced
- `tetradic` - Four colors (rectangle)
- `complementary` - Opposite colors

## pair

Creates paired color palettes.

```typescript
import { pair } from "@skchr/color";

pair("green", { hueStep: 6, samples: 4 });
```

## discover

Finds color schemes from a collection.

```typescript
import { discover } from "@skchr/color";

discover(["red", "blue", "green"], { kind: "tetradic" });
```

## interpolator

Interpolates between colors.

```typescript
import { interpolator } from "@skchr/color";

interpolator(["red", "blue"], { num: 5 });
// ['#ff0000', '#bf0040', '#7f0080', '#4000c0', '#0000ff']
```
