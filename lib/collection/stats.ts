/**
 *  Dean Tarisai
 *  @license GPL-3.0
 *
 */

import { averageNumber, averageAngle } from "culori/fn";
import type {
  Collection,
  ColorToken,
  Factor,
  Stats,
  StatsOptions,
} from "../types.d.ts";
import { family, mc, luminance, achromatic } from "../utils/index.ts";
import {
  chnDiff,
  iterator,
  mcchn,
  ctrst,
  dstnce,
  sortedColl,
  map,
  values,
} from "../internal/index.ts";

/**
 *
 * Computes statistical values about the specified `factor(s)` from the passedin collection.
 *
 * The properties from each returned `factor` object are:
 *
 * * `against` - The color being used for comparison. Required for the `distance` and `contrast` factors.
 * If `relativeMean` is `false`, other factors that take the comparison color token as an overload (`contrast | distance`) will have this property's value as `null`.
 * * `colorspace` - The colorspace in which the `factors` were computed in. It has no effect on the `contrast` or `distance` factors (for now).
 *
 * * `extremums` - An array of the minimum and the maximum value (respectively) of the `factor`.
 * * `colors` - An array of color tokens that have the minimum and maximum `extremum` values respectively.
 * * `mean` - The average value for the `factor`.
 *
 * The `mean` property can be overloaded by the `relativeMean` option:
 *
 * * If `relativeMean` is `true`, the `against` option will be used as a subtrahend for calculating the distance between each `extremum`.
 * For example, it will mean "Get the largest/smallest distance between `factor` as compared `against` this color token otherwise just get the smallest/largest `factor` from the passed in collection."
 *
 *
 * These properties are available at the topmost level of the resultant object:
 *
 * * `achromatic` - The amount of colors which are gray out of the total colors in the collection as a value in the range [0,1].
 * * `colorspace` - The colorspace in which the values were computed from, expected to be hue based.
 * Defaults to `lch` if an invalid mode like `rgb` is used.
 *
 *
 * * The `factor` is expected to be an array of strings with each element being a valid `factor`. Every key is a `factor`, with the stats of that `factor` as the value in the result object.
 *
 * To get all the factors in the result object pass `undefined` to `factor`.
 *
 *
 * @param  collection The collection to compute stats from. Any collection with color tokens as values will work.
 * @param options The optional overrides to customize the computing behaviour for the factors.
 */
export default function stats(
  collection: Collection = [],
  options?: StatsOptions,
): Stats {
  let { factor, relative, against, colorspace } =
    options || ({} as StatsOptions);

  colorspace = colorspace || "lch";
  against = against || "cyan";
  relative = relative || false;

  const getStatsObject = (fact: Factor) => {
    /**
     * The callback to use for calculating the specified factor's mean.
     * */
    // @ts-ignore:
    let meanCallback: unknown;
    if (relative && !["contrast", "distance"].includes(fact?.toLowerCase())) {
      meanCallback = {
        chroma:
          // @ts-ignore:
          chnDiff(against, mcchn("c", colorspace)),

        luminance: (a: ColorToken) =>
          Math.abs(luminance(a) - luminance(against)),
        lightness: chnDiff(against, mcchn("l", colorspace)),
        hue: chnDiff(against, `${colorspace}.h`),
      };

      // @ts-ignore:
    } else {
      meanCallback = {
        contrast: ctrst(against),
        distance: dstnce(against),
        chroma: mc(mcchn("c", colorspace)),

        luminance: luminance,
        lightness: mc(mcchn("l", colorspace)),

        hue: mc(`${colorspace}.h`),
      };
    }

    return sortedColl(
      fact,
      // @ts-ignore:
      meanCallback[fact],
    )(collection);
  };

  /**
   * @param b The callback func for computing the targeted factor. Must be unary
   * @param c The function to wrap the resulting collection of computed factors in.
   */
  const callback =
    (b: (x?: ColorToken) => number) => (c: (x: number[]) => number) =>
      c(map(collection, b) as number[]);

  const len: number = values(collection).length;
  const commonStats = (fact: Factor) => {
    // @ts-ignore:
    const x = getStatsObject(fact)[0];
    // @ts-ignore:
    const y = getStatsObject(fact)[len - 1];
    const factorStats = {
      chroma: [mc(mcchn("c", colorspace)), averageNumber],
      distance: [dstnce(against), averageNumber],

      hue: [mc(`${colorspace}.h`), averageAngle],
      lightness: [mc(mcchn("l", colorspace)), averageNumber],
      contrast: [ctrst(against), averageNumber],
      luminance: [luminance, averageNumber],
    }[fact];

    const res = {
      against:
        relative || ["contrast", "distance"].includes(fact) ? against : null,
      colors: [x?.color, y?.color],
      // @ts-ignore:
      mean: callback(factorStats[0])(factorStats[1]),
      extremums: [x[fact], y[fact]],

      families: [family(x?.color), family(y?.color)],
    };
    return res;
  };

  // @ts-ignore:
  const statsObject = iterator(
    factor,
    // @ts-ignore:
    commonStats,
    true,
  ) as Stats;

  // @ts-ignore:
  statsObject.achromatic = values(collection).filter(achromatic).length / len;

  // @ts-ignore:
  statsObject.colorspace = colorspace;

  return statsObject;
}
