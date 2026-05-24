# Feature Reference

> Complete documentation of every symbol in the public API of `@prjctimg/huetiful`.

---

## Utility Functions (`lib/utils/index.ts`)

### `token(color?, options?)`
Parses any recognizable color token (string, number, array, object) into the specified output format.
- **Params:**
  - `color: ColorToken` (default: `"cyan"`) — The color to parse.
  - `options?: TokenOptions` — Parsing options:
    - `kind?: "str" | "num" | "arr" | "obj"` (default: `"str"`) — Output type.
    - `numType?: "expo" | "hex" | "oct" | "bin"` — Number format when `kind: "num"`.
    - `omitMode?: boolean` — Omit mode string from array output.
    - `omitAlpha?: boolean` — Omit alpha from array/object output.
    - `normalizeRgb?: boolean` — Normalize RGB [0,255] values to [0,1].
    - `srcMode?: Colorspaces` — Source colorspace for array tokens without mode.
    - `targetMode?: Colorspaces` — Target colorspace for object output.
- **Returns:** `ColorToken` (string, number, array, or object depending on `kind`).

### `mc(modeChannel)`
Returns a curried function that gets or sets a specific channel value of a color.
- **Params:** `modeChannel: string` — Dot-notation like `"rgb.g"` or `"lch.h"`.
- **Returns:** Function `(color?, value?) => number | ColorToken`.
  - Without `value`: returns the channel value as a number.
  - With `value`: sets the channel and returns the modified color token.

### `alpha(color?, amount?)`
Gets or sets the alpha (opacity) channel of a color.
- **Params:**
  - `color: ColorToken` (default: `"cyan"`)
  - `amount?: number | string` — If omitted, returns current alpha. If a number in [0,1], sets the alpha. Supports math expression strings like `"*0.5"`.
- **Returns:** `number` (getting) or `ColorToken` (setting).

### `luminance(color?, amount?)`
Gets or sets the WCAG relative luminance of a color.
- **Params:**
  - `color?: ColorToken`
  - `amount?: number` — If omitted, returns current luminance (0-1). If provided, adjusts luminance by interpolating with black/white.
- **Returns:** `number` (getting) or `ColorToken` (setting).

### `lightness(color, options?)`
Darkens or lightens a color by adjusting the lightness channel in the Lab colorspace.
- **Params:**
  - `color: ColorToken`
  - `options?: LightnessOptions`:
    - `amount?: number` (default: `0.1`) — Amount to adjust (fraction of channel range).
    - `darken?: boolean` (default: `false`) — If true, darkens; if false, lightens.
- **Returns:** `ColorToken`

### `achromatic(color)`
Checks whether a color is achromatic (grayscale, no hue).
- **Params:** `color: ColorToken`
- **Returns:** `boolean`

### `family(color, bias?)`
Returns the hue family a color belongs to (e.g., `"red"`, `"blue-green"`), or `"gray"` if achromatic.
- **Params:**
  - `color: ColorToken`
  - `bias?: boolean` (default: `false`) — If `true`, returns `{ hue, bias }` where `bias` is the overtone.
- **Returns:** `BiasedHues & ColorFamily` or `{ hue, bias }` object.

### `temp(color?)`
Returns a rough estimation of a color's temperature.
- **Params:** `color: ColorToken` (default: `"cyan"`)
- **Returns:** `"cool" | "warm"`

---

## Palette / Lookup Functions (`lib/palettes/index.ts`)

### `colors(shade?, value?)`
Returns Tailwind CSS default palette colors.
- **Params:**
  - `shade?: Tailwind | "all"` — Color family name (e.g., `"red"`, `"blue"`, `"all"`).
  - `value?: ScaleValues` — Tone value (e.g., `"500"`, `"900"`, `50`).
- **Returns:** `Array<string>` (hex strings) or a single hex string.

### `sequential(scheme?)`
Returns a ColorBrewer sequential color scheme.
- **Params:** `scheme?: SequentialScheme | Array<SequentialScheme>`
- **Returns:** `Array<Scheme>` or object of arrays.

### `diverging(scheme?)`
Returns a ColorBrewer diverging color scheme.
- **Params:** `scheme?: DivergingScheme | Array<DivergingScheme>`
- **Returns:** `Array<Scheme>` or object of arrays.

### `qualitative(scheme?)`
Returns a ColorBrewer qualitative color scheme.
- **Params:** `scheme?: QualitativeScheme | Array<QualitativeScheme>`
- **Returns:** `Array<Scheme>` or object of arrays.

### `nearest(collection, options)`
Finds the nearest color(s) in a collection against a target using the `differenceHyab` metric.
- **Params:**
  - `collection: Collection | "tailwind"` — Colors to search, or `"tailwind"` for Tailwind palette.
  - `options: { against: ColorToken; num?: number }`
- **Returns:** `ColorToken` (if `num=1`) or `Array<ColorToken>` (if `num>1`).

---

## Accessibility Functions (`lib/accessibility/index.ts`)

### `contrast(a?, b?)`
Calculates the WCAG contrast ratio between two colors (range 1-21).
- **Params:** `a: ColorToken` (default: `"white"`), `b: ColorToken` (default: `"black"`).
- **Returns:** `number`

### `deficiency(color?, options?)`
Simulates how a color is perceived by people with color vision deficiency (CVD).
- **Params:**
  - `color: ColorToken` (default: `"cyan"`)
  - `options?: DeficiencyOptions`:
    - `kind?: "red" | "blue" | "green" | "mono"` (default: `"red"`)
    - `severity?: number` (default: `0.5`)
    - `token?: TokenOptions`
- **Returns:** `ColorToken`

---

## Collection Operation Functions (`lib/collection/index.ts`)

### `sortBy(collection, options?)`
Sorts a collection of colors by specified factor(s).
- **Params:**
  - `collection: Collection`
  - `options?: SortByOptions`:
    - `factor?: Array<Factor>` — Factors to sort by.
    - `order?: "asc" | "desc"` (default: `"asc"`)
    - `against?: ColorToken` — Reference color for contrast/distance.
    - `colorspace?: Colorspaces`
    - `relative?: boolean`
    - `factorObject?: boolean`
- **Returns:** `Collection`

### `filterBy(collection, options?)`
Filters a collection of colors by specified factor ranges.
- **Params:**
  - `collection: Collection`
  - `options?: FilterByOptions`:
    - `factor?: Array<Factor>`
    - `ranges?: object | Array` — Start/end ranges per factor; supports expression strings.
    - `against?: ColorToken`
    - `colorspace?: Colorspaces`
    - `factorObject?: boolean`
- **Returns:** `Collection`

### `stats(collection, options?)`
Computes statistical values for specified factors across a color collection.
- **Params:**
  - `collection: Collection`
  - `options?: StatsOptions`:
    - `factor?: Array<Factor>`
    - `against?: ColorToken`
    - `colorspace?: Colorspaces`
    - `relative?: boolean`
- **Returns:** `Stats` object with extremums, mean, families, achromatic ratio.

### `distribute(collection, options?)`
Distributes a factor's extremum value across all colors in a collection.
- **Params:**
  - `collection: Collection`
  - `options?: DistributionOptions`:
    - `factor?: Array<Factor>` (default: `["chroma"]`)
    - `extremum?: "min" | "max" | "mean"`
    - `colorspace?: Colorspaces`
    - `hueFixup?: "longer" | "shorter"`
    - `excludeAchromatic?: boolean`
    - `excludeSelf?: boolean`
    - `token?: TokenOptions`
- **Returns:** `Collection`

---

## Palette Generator Functions (`lib/generators/index.ts`)

### `interpolator(baseColors, options?)`
Interpolates between a collection of colors and returns evenly spaced samples.
- **Params:**
  - `baseColors: Collection` (default: `[]`)
  - `options?: InterpolatorOptions`:
    - `num?: number` (default: `1`)
    - `colorspace?: Colorspaces`
    - `stops?: number[]`
    - `easingFn?: (t: number) => number`
    - `hueFixup?: "longer" | "shorter"`
    - `kind?: "basis" | "monotone" | "natural"` (default: `"basis"`)
    - `closed?: boolean`
    - `tokenOptions?: TokenOptions`
- **Returns:** `Array<ColorToken>` or `ColorToken`

### `scheme(baseColor?, options?)`
Generates randomized classic color schemes (analogous, triadic, tetradic, complementary).
- **Params:**
  - `baseColor?: ColorToken`
  - `options?: SchemeOptions`:
    - `kind?: Array<SchemeType>`
    - `colorspace?: Colorspaces` (default: `"lch"`)
    - `easingFn?: (t: number) => number`
    - `token?: TokenOptions`
- **Returns:** `Collection`

### `discover(colors, options?)`
Finds nearest classic scheme matches from a collection of colors.
- **Params:**
  - `colors: Collection`
  - `options?: DiscoverOptions`:
    - `kind?: Array<SchemeType>`
    - `minDistance?: number` (default: `0`)
    - `maxDistance?: number` (default: `0.0014`)
    - `colorspace?: Colorspaces`
    - `token?: TokenOptions`
- **Returns:** `Collection`

### `pair(baseColor?, options?)`
Creates a paired color scheme by incrementing hue by a step and interpolating via white or black.
- **Params:**
  - `baseColor?: ColorToken`
  - `options?: PairedSchemeOptions`:
    - `hueStep?: number` (default: `5`)
    - `via?: "light" | "dark"` (default: `"light"`)
    - `num?: number`
    - Inherits from `InterpolatorOptions`.
- **Returns:** `Collection | ColorToken`

### `hueshift(baseColor?, options?)`
Creates a hue-shifted palette — lighter with increased hue, darker with decreased hue.
- **Params:**
  - `baseColor?: ColorToken`
  - `options?: HueshiftOptions`:
    - `hueStep?: number` (default: `5`)
    - `minLightness?: number` (default: `5`)
    - `maxLightness?: number` (default: `90`)
    - `num?: number` (default: `6`)
    - Inherits from `InterpolatorOptions`.
- **Returns:** `Collection` (length: `(num * 2) + 1`)

### `earthtone(baseColor?, options?)`
Creates a color scale between an earth tone and any color token.
- **Params:**
  - `baseColor?: ColorToken`
  - `options?: EarthtoneOptions`:
    - `earthtones?: string` (default: `"dark"`) — One of: `"light-gray"`, `"silver"`, `"sand"`, `"tupe"`, `"mahogany"`, `"brick-red"`, `"clay"`, `"cocoa"`, `"dark-brown"`, `"dark"`.
    - Inherits from `InterpolatorOptions`.
- **Returns:** `ColorToken | Array<ColorToken>`

### `pastel(baseColor?)`
Returns a random pastel variant of a color.
- **Params:** `baseColor?: ColorToken`
- **Returns:** `ColorToken`

### `vangogh(baseColor?, options?)`
Generates palettes inspired by Van Gogh's artistic periods.
- **Params:**
  - `baseColor: ColorToken` (default: `"yellow"`)
  - `options?: VangoghOptions`:
    - `period?: "netherlands" | "paris" | "arles"` (default: `"arles"`)
    - `contrast?: "subtle" | "medium" | "bold"` (default: `"bold"`)
    - `num?: number` (default: `6`)
- **Returns:** `Collection`

### `impressionist(baseColor?, options?)`
Generates palettes inspired by Impressionist painting techniques.
- **Params:**
  - `baseColor: ColorToken` (default: `"green"`)
  - `options?: ImpressionistOptions`:
    - `technique?: "broken" | "optical"` (default: `"broken"`)
    - `timeOfDay?: "morning" | "noon" | "evening" | "dusk"` (default: `"noon"`)
    - `blueShadows?: boolean` (default: `true`)
    - `num?: number` (default: `6`)
- **Returns:** `Collection`

### `picasso(baseColor?, options?)`
Generates palettes inspired by Picasso's Blue Period and Rose Period.
- **Params:**
  - `baseColor: ColorToken` (default: `"blue"`)
  - `options?: PicassoOptions`:
    - `period?: "blue" | "rose"` (default: `"blue"`)
    - `intensity?: number` (default: `0.5`)
    - `num?: number` (default: `6`)
- **Returns:** `Collection`

---

## Class Wrappers (`lib/wrappers/index.ts`)

### `class ColorArray`
A lazy chain wrapper over a collection of colors.
- **Constructor:** `new ColorArray(colors: Collection, implicitReturn?: boolean)`
- **Methods:**
  - `.nearest(options?)` — Find nearest colors.
  - `.interpolator(options?)` — Interpolate colors.
  - `.discover(options?)` — Discover palette schemes.
  - `.filterBy(options?)` — Filter by factor.
  - `.sortBy(options?)` — Sort by factor.
  - `.stats(options?)` — Compute statistics.
  - `.output()` — Return the final collection.

### `class Color`
A lazy chain wrapper over a single color token.
- **Constructor:** `new Color(c: ColorToken, options?: ColorOptions)`
- **Methods:**
  - `.alpha(amount?)` — Get/set alpha.
  - `.mc(modeChannel, value?)` — Get/set a channel.
  - `.via(origin)` — Interpolate via another color.
  - `.lightness(amount?, darken?)` — Darken/lighten.
  - `.token(options?)` — Parse/convert color.
  - `.pastel()` — Random pastel variant.
  - `.pair(options?)` — Paired scheme.
  - `.hueshift(options?)` — Hue-shifted palette.
  - `.family()` — Get hue family.
  - `.earthtone(options?)` — Earth tone palette.
  - `.contrast(against?)` — Get contrast ratio.
  - `.luminance(amount?)` — Get/set luminance.
  - `.saturation(amount?)` — Get/set saturation.
  - `.achromatic()` — Check if grayscale.
  - `.temp()` — Get warm/cool.
  - `.deficiency(options?)` — Simulate CVD.
  - `.scheme(options?)` — Generate classic scheme.
  - `.output()` — Return the bound color.

---

## Constants (`lib/constants/index.ts`)

### `hue`
Internal hue ranges for determining color families and temperature. Array of `[ColorFamily, [warmStart, warmEnd], [coolStart, coolEnd]]` tuples.

### `limits`
Channel range limits for various color spaces (e.g., `lch.l: [0,100]`). Used internally by `filterBy()` and `distribute()` for range normalization.

---

## Exported Type Definitions (`lib/types.d.ts`)

| Type | Kind | Description |
|------|------|-------------|
| `ColorToken` | Union | Any recognizable color value: `number \| string \| boolean \| object \| ColorTuple` |
| `ColorTuple` | Array | Channel array with optional mode and alpha |
| `Colorspaces` | Union | `"lab" \| "rgb" \| "lch" \| "lch65" \| "xyz65" \| "xyz" \| "lrgb" \| "hsv"` |
| `Factor` | Union | `"luminance" \| "chroma" \| "contrast" \| "distance" \| "lightness" \| "hue"` |
| `Collection` | Union | `Array<ColorToken> \| Map \| Set \| object` |
| `Order` | Union | `"asc" \| "desc"` |
| `SchemeType` | Union | `"analogous" \| "triadic" \| "tetradic" \| "complementary"` |
| `Tone` | Union | `"light" \| "dark"` |
| `DeficiencyType` | Union | `"red" \| "blue" \| "green" \| "mono"` |
| `BiasedHues` | Union | `"red-purple" \| "yellow-red" \| "green-yellow" \| "blue-green" \| "purple-blue"` |
| `ColorFamily` | Union | `"red" \| "green" \| "blue" \| "yellow" \| "purple" \| "gray"` |
| `Tailwind` | Union | 20 Tailwind color family names |
| `ScaleValues` | Union | `"050" \| "100" \| ... \| "950"` |
| `SequentialScheme` | Union | 19 ColorBrewer sequential scheme names |
| `DivergingScheme` | Union | 9 ColorBrewer diverging scheme names |
| `QualitativeScheme` | Union | 8 ColorBrewer qualitative scheme names |
| `Fact<F>` | Conditional | `number` or `{ factor, color }` object |
| `TokenOptions` | Interface | Parsing/output customization |
| `InterpolatorOptions` | Interface | Interpolation customization |
| `FilterByOptions` | Interface | Filtering criteria |
| `SortByOptions` | Interface | Sort configuration |
| `StatsOptions` | Interface | Stats computation options |
| `Stats` | Interface | Stats result shape |
| `DistributionOptions` | Interface | Factor distribution options |
| `DiscoverOptions` | Interface | Palette discovery options |
| `SchemeOptions` | Interface | Classic scheme options |
| `HueshiftOptions` | Interface | Hue shift options |
| `PairedSchemeOptions` | Interface | Paired scheme options |
| `EarthtoneOptions` | Interface | Earth tone options |
| `NearestOptions` | Interface | Nearest color search options |
| `DeficiencyOptions` | Interface | Color blindness simulation |
| `ColorOptions` | Interface | Color class constructor options |
| `LightnessOptions` | Interface | Lightness adjustment options |
| `AdaptivePaletteOptions` | Interface | Adaptive light/dark mode options |
| `VangoghOptions` | Interface | Van Gogh palette options |
| `ImpressionistOptions` | Interface | Impressionist palette options |
| `PicassoOptions` | Interface | Picasso palette options |
| `IdentityFunc` | Type Alias | `(x: unknown) => unknown` |
