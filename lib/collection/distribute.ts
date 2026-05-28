import { iterator, mcchn, values } from "../internal/index.ts";
import type {
  Collection,
  ColorToken,
  DistributionOptions,
  Factor,
} from "../types.d.ts";
import { achromatic, luminance, mc, token } from "../utils/index.ts";

/**
 * distributes the `factor`(s) of a color in the collection at the specified `extremum` (i.e the color with the smallest/largest `hue` angle or `chroma` value) to all color tokens in the collection.
 * @param {Collection} collection - The collection of colors to distribute values to.
 * @param {DistributionOptions} [options] - Optional overrides to change the default configuration.
 * @returns {Collection} - The collection of colors with the distributed factor values.
 */
export default function distribute<Options extends DistributionOptions>(
  collection: Collection,
  options?: Options,
): Collection {
  let {
    extremum,
    excludeSelf,
    excludeAchromatic,
    colorspace,
    factor,
    token: tokenOptions,
  } = (options || {}) as Options;

  extremum = extremum || "max";
  factor = factor || ["chroma"];
  excludeSelf = excludeSelf || false;
  excludeAchromatic = excludeAchromatic || false;

  if (excludeAchromatic) {
    collection = values(collection).filter(
      (c) => !achromatic(c),
    ) as Collection;
  }

  colorspace = colorspace || "lch";

  const callback = (fact: Factor) => {
    const allColors = values(collection) as ColorToken[];
    const channelKey =
      fact === "luminance"
        ? "l"
        : fact === "chroma"
          ? mcchn("c", colorspace, false)
          : fact === "lightness"
            ? mcchn("l", colorspace, false)
            : "h";

    const mode = fact === "luminance" ? "lab" : colorspace;

    const getFactorValue = (tkn: ColorToken): number => {
      if (fact === "luminance") return luminance(tkn) as number;
      return mc(`${colorspace}.${channelKey}`)(tkn) as number;
    };

    const setFactorValue = (tkn: ColorToken, val: number): ColorToken => {
      if (fact === "luminance")
        return luminance(tkn, val) as ColorToken;
      const obj = token(tkn, {
        kind: "obj",
        targetMode: mode,
      }) as Record<string, unknown>;
      obj[channelKey] = val;
      return token(obj, tokenOptions) as ColorToken;
    };

    const allValues = allColors.map(getFactorValue);

    let extremumValue: number;
    if (extremum === "mean") {
      extremumValue =
        allValues.reduce((a, b) => a + b, 0) / allValues.length;
    } else if (extremum === "min") {
      extremumValue = Math.min(...allValues);
    } else {
      extremumValue = Math.max(...allValues);
    }

    const extremumIndices = new Set<number>();
    if (excludeSelf && extremum !== "mean") {
      allValues.forEach((v, i) => {
        if (v === extremumValue) extremumIndices.add(i);
      });
    }

    return allColors
      .map((tkn, i) => {
        if (excludeSelf && extremumIndices.has(i)) return null;
        return setFactorValue(tkn, extremumValue);
      })
      .filter((c): c is ColorToken => c !== null);
  };

  return iterator(factor, callback, true, [
    "chroma",
    "hue",
    "lightness",
  ]) as Collection;
}
