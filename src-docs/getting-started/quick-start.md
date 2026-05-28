---
title: Quick Start
---

# Quick Start

## Color Tokens

Color supports multiple color formats:

```typescript
import { token } from "@skchr/color";

// CSS named colors
token("pink"); // "#ffc0cb"

// Hex colors
token("#ff5500"); // "#ff5500"

// Numbers
token(0xff5500); // "#ff5500"

// RGB arrays
token(["rgb", 255, 85, 0]); // "#ff5500"

// Color objects
token({ mode: "rgb", r: 1, g: 0.33, b: 0 }); // "#ff5500"
```

## Converting Colors

```typescript
import { token } from "@skchr/color";

// Convert to different formats
token("cyan", { kind: "obj", targetMode: "lch" });
// { mode: "lch", l: 91.1, c: 72.8, h: 185.6 }

token("cyan", { kind: "arr" });
// ["rgb", 0, 1, 1]

token("cyan", { kind: "num" });
// 65535
```

## Generating Palettes

```typescript
import { hueshift, earthtone, pastel } from "@skchr/color";

// Hue-shifted palette
hueshift("#3e0000");
// ['#ffffe1', '#ffdca5', '#ca9a70', ...]

// Earth tone palette
earthtone("pink", { earthtones: "clay" });
// ['#6a5c52', '#8d746a', '#b38d86', ...]

// Pastel palette
pastel("blue");
// ['#b8d4e8', '#c4dcf0', '#d6e4f8', ...]
```

## Collection Methods

```typescript
import { sortBy, filterBy, colors } from "@skchr/color";

const palette = colors("all", "500");

// Sort by hue
sortBy(palette, { factor: ["hue"], order: "asc" });

// Filter by contrast
filterBy(palette, {
  factor: ["contrast"],
  against: "white",
  ranges: { contrast: [">=4.5"] },
});
```

## Chainable API

```typescript
import { Color, ColorArray } from "@skchr/color";

// Single color chain
new Color("red").lightness(0.3).saturation("*0.5").output();

// Color collection chain
new ColorArray(["red", "blue", "green"])
  .sortBy({ factor: ["hue"], order: "asc" })
  .filterBy({ factor: ["chroma"], ranges: { chroma: [">20"] } })
  .output();
```
