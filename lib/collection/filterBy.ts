import { limits } from "../constants/index.ts";
import {
  COLOR_SPACES,
  ctrst,
  dstnce,
  filteredColl,
  iterator,
  mcchn,
} from "../internal/index.ts";
import type {
  Collection,
  Colorspaces,
  Factor,
  FilterByOptions,
} from "../types.d.ts";
import { luminance, mc, token } from "../utils/index.ts";

/**
 * Filters a collection of colors using the specified `factor` as the criterion.
 *
 *
 * * The `factor` is expected to be an array of strings with each element being a valid `factor`. Every key is a `factor`, with the filtered collection as the value in the result object.
 *
 * To get all the factors in the result object pass `undefined` to `factor`.
 *
 *
 * The supported options are:
 * * `'contrast'` - Returns colors with the specified contrast range. The contrast is tested against a comparison color (the `'against'` param) and the specified contrast ranges.
 * * `'lightness'` - Returns colors in the specified lightness range.
 * * `'chroma'` - Returns colors in the specified `saturation` or `chroma` range. The range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.

 * * `'distance'` - Returns colors with the specified `distance` range. The `distance` is tested against a comparison color (the `'against'` param) and the specified `distance` ranges. Uses the `differenceHyab` metric for calculating the distances.
 * * `luminance` - Returns colors in the specified luminance range.
 * * `'hue'` - Returns colors in the specified hue ranges between 0 to 360.
 *
 *
 * For the `chroma` and `lightness` factors, the range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.
 * This means a value in the range `[0,1]` will return, for example if you pass `start` as `0.3` it means `0.3 (or 30%)` of the channel's supported range.
 * But if the value of either `start` or `end` is above 1 AND the `colorspace` in use has an `end` range higher than 1 then the value is treated as is else the value is treated as if in the range specified in [Culori's](https://culorijs.org/color-spaces) and will return the normalized value.
 *
 * [See the color spaces page](https://culorijs.org/color-spaces/) for the expected ranges.
 *
 *
 * Supports expression strings e.g `'>=0.5'`.
 *
 * The supported symbols are `== | === | != | !== | >= | <= | < | >`
 * @param {Collection} collection - The collection of colors to filter. Any object with enumerable keys and color tokens as values will work.
 * @param {FilterByOptions} [options] - Options to customise filtering behaviour.
 * @returns {Collection} - The filtered collection of colors.
 * @example
 *
 * import { filterBy } from '@skchr/color'

  let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
  ]

 */
export default function filterBy(
  collection: Collection = [],
  options: FilterByOptions = {
    against: "cyan",
    colorspace: "lch",
    factor: undefined,
    ranges: undefined,
  },
): Collection {
  let { against, colorspace, factor, ranges, factorObject } =
    options || ({} as FilterByOptions);

  //  handling defaults internally helps avoid undefined values as compared to passing it to the parameter list
  against = against || "cyan";
  colorspace =
    COLOR_SPACES.includes(
      colorspace?.toLowerCase() as Colorspaces,
      // @ts-ignore:
    ) && /h/gi.test(colorspace)
      ? colorspace
      : "lch";

  //  get the saturation and lightness channels
  const chromaChannel = mcchn("c", colorspace, false);

  const lightnessChannel = mcchn("l", colorspace, false);
  const defRanges = {
    hue: [0, 359],
    contrast: [0, 21],

    // @ts-ignore:
    chroma:
      // @ts-ignore:
      limits[colorspace][chromaChannel],

    lightness:
      // @ts-ignore:
      limits[colorspace][lightnessChannel],

    distance: [0, Number.POSITIVE_INFINITY],
    luminance: [0, 1],
  };
  let start: number, end: number;

  const callback = (fact: Factor) => {
    // @ts-ignore:
    start = ranges[fact][0] || defRanges[fact][0];
    // @ts-ignore:
    end = ranges[fact][1] || defRanges[fact][1];

    // the callback fn to use when comparing factors

    const filteringCallback = {
      chroma: mc(mcchn("c", colorspace)),

      lightness: mc(mcchn("l", colorspace)),
      hue: mc(`${colorspace}.h`),
      distance: dstnce(token(against)),
      contrast: ctrst(against),
      luminance: luminance,
    }[fact];
    // @ts-ignore:
    return filteredColl(fact, filteringCallback)(collection, start, end);
  };

  // @ts-ignore:
  return iterator(factor, callback, factorObject);
}
