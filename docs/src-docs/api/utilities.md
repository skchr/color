---
title: Utilities
---

# Utilities

## token

Parses any recognizable color to the specified format.

```typescript
import { token } from "@skchr/color";

// Convert to hex string (default)
token("cyan"); // "#00ffff"

// Convert to object
token("cyan", { kind: "obj", targetMode: "lch" });

// Convert to array
token("cyan", { kind: "arr" });

// Convert to number
token("cyan", { kind: "num" });
```

## alpha

Gets or sets the alpha channel of a color.

```typescript
import { alpha } from "@skchr/color";

// Get alpha
alpha("#a1bd2f0d"); // 0.050980392156862744

// Set alpha
alpha("b2c3f1", 0.5); // "#b2c3f180"
```

## luminance

Gets or sets the luminance of a color.

```typescript
import { luminance } from "@skchr/color";

// Get luminance
luminance("#a1bd2f"); // 0.4417749513730954

// Set luminance
luminance("#a1bd2f", 0.5);
```

## lightness

Darkens or lightens a color.

```typescript
import { lightness } from "@skchr/color";

// Lighten
lightness("blue", { amount: 0.3 }); // "#464646"

// Darken
lightness("blue", { amount: 0.3, darken: true });
```

## family

Returns the hue family of a color.

```typescript
import { family } from "@skchr/color";

family("#310000"); // "red"
family("blue"); // "blue"
```

## temp

Returns whether a color is cool or warm.

```typescript
import { temp } from "@skchr/color";

temp("blue"); // "cool"
temp("red"); // "warm"
```

## achromatic

Checks if a color is grayscale.

```typescript
import { achromatic } from "@skchr/color";

achromatic("gray"); // true
achromatic("pink"); // false
```

## mc

Gets or sets a specific channel value.

```typescript
import { mc } from "@skchr/color";

// Get RGB green channel
mc("rgb.g")("#a1bd2f"); // 0.7411764705882353

// Set channel
mc("lch.l")("blue", 50);
```
