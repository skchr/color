---
title: Installation
---

# Installation

## npm

```bash
npm install @skchr/color
```

## yarn

```bash
yarn add @skchr/color
```

## bun

```bash
bun add @skchr/color
```

## Deno

```bash
deno add jsr:@skchr/color
```

## Usage

Import functions from the package:

```typescript
import { token, colors, hueshift } from "@skchr/color";

// Parse a color to hex
token("cyan"); // "#00ffff"

// Get Tailwind colors
colors("red"); // ['#fef2f2', '#fee2e2', ...]

// Generate a hue-shifted palette
hueshift("#3e0000"); // ['#ffffe1', '#ffdca5', ...]
```

## Requirements

- TypeScript 5.0+
- ES Modules support
