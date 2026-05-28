import {
  entries,
  iterator,
  keys,
  mcchn,
  or,
  rand,
  adjustHue,
  ef,
} from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type { Collection, ColorToken, SchemeOptions } from "../types.d.ts";
import { samples } from "culori/fn";

/**
 * Generates a randomised classic scheme from the passed in color.
 *
 * The `kind` parameter can either be an array or `undefined`:
 *
 * * If it is an array, each element should be a valid `kind` of scheme.
 * It will return a color map with the array elements (which are valid schemes)  as keys.
 * Duplicate schemes are simply ignored.
 * * If it is falsy it will return a color map of all palettes.
 *
 * 
 * The classic schemes are are:
 *
 * * `triadic` - Picks 3 colors 120 degrees apart.
 * * `tetradic` - Picks 4 colors 90 degrees apart.
 * * `complimentary` - Picks 2 colors 180 degrees apart.
 * * `mono` - Picks `num` amount of colors from the same hue family   .
 * * `analogous` - Picks 3 colors 12 degrees apart.
 *
 * 
 * Note that the `num` parameter works on the `monochromatic` palette type only. Other schemes will return a constant amount of samples.
 * 
 *
 * @param {ColorToken} [baseColor] - The color to create the palette(s) from.
 * @param {SchemeOptions} [options] - Optional overrides.
 * @returns {Collection} - A collection of colors forming a classic color scheme.
 * @example
 *
 import { scheme } from '@skchr/color'

console.log(scheme("triadic")("#a1bd2f"))
// [ '#a1bd2f', '#00caff', '#ff78c9' ]
 */
// @ts-ignore:
export default function scheme(
  baseColor?: ColorToken,
  options: SchemeOptions = {
    colorspace: "lch",
    kind: ["analogous"],
    easingFn: ef,
  },
): Collection {
  const { colorspace, kind, easingFn } = options || {};

  // @ts-ignore:
  baseColor = token(baseColor, { targetMode: colorspace, kind: "obj" });

  // // extremums
  const [lowMin, lowMax, highMin, highMax] = [0.05, 0.495, 0.5, 0.995],
    // @ts-ignore:
    generateSteps = (stops, step) => {
      const res: unknown[] = [];

      for (let [k, v] of entries(samples(stops))) {
        v = adjustHue(
          // @ts-ignore:
           (baseColor.h + step) * (v * or(easingFn, ef)(v)),
        );
        // @ts-ignore:
        res[k] =
          rand(v * lowMax, v * lowMin) + rand(v * highMax, v * highMin) / 2;
      }
      return res;
    },
    PALETTE_TYPES = {
      analogous: generateSteps(3, 12),
      triadic: generateSteps(3, 120),
      tetradic: generateSteps(4, 90),
      complimentary: generateSteps(2, 180),
    },
    // @ts-ignore:
    callback = (kind) => {
      // // For each step return a  random value between lowMin && lowMax mult ied by highMin && highMax and 0.9 of the step

      // // The map for steps to obtain the targeted palettes

      const [lightnessChan, chromaChan] = ["l", "c"].map((a) =>
          mcchn(a, colorspace, false),
        ),
        // @ts-ignore:
        palettes = [];
      // @ts-ignore:
      for (const [idx, step] of entries(PALETTE_TYPES[kind])) {
        // @ts-ignore:
        palettes[idx] = token(
          {
            // @ts-ignore:
            [lightnessChan]: baseColor[lightnessChan],
            // @ts-ignore:
            [chromaChan]: baseColor[chromaChan],
            // @ts-ignore:
            h: adjustHue(baseColor.h + step),
            mode: colorspace,
          },
          options?.token,
        );
      }
      // @ts-ignore:
      palettes.shift();
      // @ts-ignore:
      return palettes;
    };

  return iterator(kind, callback, keys(PALETTE_TYPES));
}
