import {
  COLOR_SPACES,
  chnDiff,
  ctrst,
  dstnce,
  iterator,
  mcchn,
  sortedColl,
} from "../internal/index.ts";
import type {
  Collection,
  ColorToken,
  Colorspaces,
  Factor,
  SortByOptions,
} from "../types.d.ts";
import { luminance, mc, token } from "../utils/index.ts";

/**
 * Sorts colors according to the specified `factor(s)`. The supported options are:
 *
 *
 * * The `factor` is expected to be an array of strings with each element being a valid `factor`. Every key is a `factor`, with the sorted collection as the value in the result object.
 *
 * To get all the factors in the result object pass `undefined` to `factor`.
 *
 *
 * * `'contrast'` - Sorts colors according to their contrast value as defined by WCAG.
 * The contrast is tested `against` a comparison color  which can be specified in the `options` object.
 * * `'lightness'` - Sorts colors according to their lightness.
 * * `'chroma'` - Sorts colors according to the intensity of their `chroma` in the `colorspace` specified in the `options` object.
 * * `'distance'` - Sorts colors according to their distance.
 * The distance is computed from the `against` color token which is used for comparison for all the colors in the `collection`.
 * * `luminance` - Sorts colors according to their relative brightness as defined by the WCAG3 definition.
 *
 * The return type is determined by the type of `collection`:
 *
 * * Plain objects are returned as `Map` objects because they remember insertion order. `Map` objects are returned as is.
 * * `ArrayLike` objects are returned as plain arrays. Plain arrays are returned as is.
 *
 * @param {Collection} collection - The collection of colors to sort. Any object with enumerable keys and color tokens as values will work.
 * @param {SortByOptions} [options] - The optional overrides to customize the sorting behaviour.
 * @returns {Collection} - The sorted collection of colors.
 * @example

import { sortBy } from '@skchr/color'

let sample = ['purple', 'green', 'red', 'brown']
console.log(
  sortBy(sample,{ against:'yellow' kind:['distance'],order:'desc',})
)

// [ 'brown', 'red', 'green', 'purple' ]
 */
export default function sortBy(
  collection: Collection = [],
  options?: SortByOptions,
): Collection {
  // @ts-ignore:
  let { against, colorspace, factor, order, relative, factorObject } =
    options || ({} as SortByOptions);

  against = against || "cyan";
  colorspace =
    COLOR_SPACES.includes(
      colorspace?.toLowerCase() as Colorspaces,
      // @ts-ignore:
    ) && /h/gi.test(colorspace)
      ? colorspace
      : "lch";
  relative = relative || false;
  order = ["desc", "asc"].includes(
    // @ts-ignore:
    order?.toLowerCase(),
  )
    ? order
    : "asc";
  // lightness and chroma channel constants respectively
  const [lchn, cchn] = ["l", "c"].map((w) => mcchn(w, colorspace, false));
  // @ts-ignore:
  for (const c in collection) {
    // @ts-ignore:

    collection[c] = token(collection[c], {
      kind: "obj",
      targetMode: "lch",
    });
  }
  // returns factor cbs determined by the options
  const callback = (fact: Factor) => {
    const lmnce = (b: ColorToken) =>
      Math.abs(luminance(against) - luminance(b));
    const u = (ch: string) => mc(`${colorspace}.${ch}`) as unknown as string;

    let sortingCallbacks: {
      [x: string]: unknown;
      chroma?: string | ((y?: ColorToken) => number);
      hue?: string | ((y?: ColorToken) => number);
      lightness?: string | ((y?: ColorToken) => number);
      luminance?: (b: ColorToken) => number;
      distance?: (b: unknown) => number;
      contrast?: (b: unknown) => number;
    };
    // if relative is true and the fact is not [contrast,distance,luminance]....
    if (
      relative &&
      !["contrast", "distance", "luminance"].includes(fact.toLowerCase())
    ) {
      // then return an object of callback fns that do not use the `against` parameter to work.
      // This creates a sort of 'overloaded' comparator fn
      sortingCallbacks = {
        chroma: chnDiff(against, u(cchn)),
        hue: chnDiff(against, u("h")),
        lightness: chnDiff(against, u(lchn)),
      };
    } else {
      // return an object with the default comparator fns
      // including the ones we did NOT want in the if... clause
      // because they're not overloadable with the `against` parameter
      sortingCallbacks = {
        chroma: u(cchn),
        hue: u("h"),
        luminance: lmnce,
        distance: dstnce(against),
        contrast: ctrst(against),
        lightness: u(lchn),
      };
    }

    return sortedColl(
      fact,
      // @ts-ignore:
      sortingCallbacks[fact],
      order,
    )(collection);
    // get our collection with the specified factor
  };

  // @ts-ignore:
  return iterator(factor, callback, factorObject);
}
