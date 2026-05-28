import {
  eq,
  gt,
  inRange,
  keys,
  dstnce,
  not,
  values,
} from "../internal/index.ts";
import type { Collection, DiscoverOptions } from "../types.d.ts";
import scheme from "./scheme.ts";

/**
 * Takes a collection of colors and finds the nearest matches using the `differenceHyab()` color difference metric for a set of predefined palettes.
 *
 * The function returns different values based on the `kind` parameter passed in:
 *
 * * An array of colors for the `kind` of scheme, if the `kind` parameter is specified.
 * * Else it returns an object of all the palette types as keys and their values as an array of colors.
 * If no colors are valid for the palette types it returns an empty array for the palette results. It does not work with achromatic colors thus they're excluded from the resulting collection.
 *
 * @param {Collection} colors - The collection of colors to create palettes from. Preferably use 6 or more colors for better results.
 * @param {DiscoverOptions} [options] - Optional overrides for palette discovery.
 * @returns {Collection} - A collection of discovered palette matches.
 * @example
 *
 * import { discover } from '@skchr/color'

let sample = [
  "#ffff00",
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#720000",
  "#600000",
  "#4e0000",
  "#3e0000",
  "#310000",
]

console.log(discover(sample, { kind:'tetradic' }))
// [ '#ffff00', '#00ffdc', '#310000', '#720000' ]
 */
export default function discover(
  colors: Collection = [],
  options: DiscoverOptions = {
    maxDistance: 0.0014,
    minDistance: 0,
    kind: undefined,
  },
): Collection {
  const colorTokenValues = values(colors),
    colorTokenKeys = keys(colors);
  const { kind, maxDistance, minDistance } = options || {};

  const palettes = {},
    customInRange = (c: string, d: string) =>
      inRange(dstnce(c)(d), minDistance, maxDistance),
    availableColors = (arg: string, obj = {}) =>
      // @ts-ignore:
      obj[arg]?.filter((c) =>
        colorTokenValues.some((d) => not(customInRange(c, d))),
      );
  // Create the classic palettes per valid color token  in the collection

  // @ts-ignore:
  for (const key of colorTokenKeys)
    palettes[key] = scheme(colors[key], { kind: kind });

  // @ts-ignore:
  let currentPalette = [];
  for (const key of colorTokenKeys) {
    if (eq(typeof kind, "string")) {
      // @ts-ignore:
      palettes[key] = availableColors(key, palettes);
      if (gt(currentPalette.length, 1))
        // @ts-ignore:
        palettes[key] = palettes[key].filter((a, b) =>
          // @ts-ignore:
          not(customInRange(a, currentPalette[b])),
        );

      // @ts-ignore:
      currentPalette = palettes[key];
    } else {
      // if the color token value is an object, iterate through the available palette keys
      // @ts-ignore:
      // @ts-ignore:
      for (const paletteType of keys(palettes[key]))
        palettes[key][paletteType] = availableColors(
          paletteType,
          // @ts-ignore:
          palettes[key],
        );
    }
  }

  // @ts-ignore:
  return palettes;
}
