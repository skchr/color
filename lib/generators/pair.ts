import { or } from "../internal/index.ts";
import { mc } from "../utils/index.ts";
import type {
  Collection,
  ColorToken,
  PairedSchemeOptions,
} from "../types.d.ts";
import interpolator from "./interpolator.ts";

/**
 * Creates a palette that consists of a `baseColor` that is incremented by a `hueStep` to get the final color to pair with.
 * The colors are then spline interpolated via white or black.
 *
 * 
 * A negative `hueStep` will pick a color that is `hueStep` degrees behind the base color.
 *
 * @param {ColorToken} baseColor - The color to return a paired color scheme from.
 * @param {PairedSchemeOptions} [options] - The optional overrides object to customize per channel options like interpolation methods and channel fixups.
 * @returns {Collection | ColorToken} - The paired color scheme as a collection or a single color token.
 * @example
 *
 * import { pair } from '@skchr/color'

console.log(pair("green",{hueStep:6,num:4,tone:'dark'}))
// [ '#008116ff', '#006945ff', '#184b4eff', '#007606ff' ]
 */
export default function pair(
  baseColor: ColorToken = "cyan",
  options?: PairedSchemeOptions,
): Collection | ColorToken {
  let { num, via, hueStep, colorspace } = (options || {}) as PairedSchemeOptions;
  via = or(via, "light");
  hueStep = or(hueStep, 5);
  colorspace = or(colorspace, "lch65");

  // get the hue of the passed in color and add it to the step which will result in the final color to pair with
  const destinationColor = mc(`${colorspace}.h`)(
    baseColor,
    // @ts-ignore:
    Math.abs(
      // @ts-ignore:
      mc(`${colorspace}.h`)(baseColor) + (hueStep > 0 ? -hueStep : hueStep),
    ),
  );

  const tone = {
    dark: { l: 0, c: 0, h: 0, mode: colorspace },
    light: { l: 100, c: 0, h: 0, mode: colorspace },
  }[via as string];

  return interpolator([baseColor, tone, destinationColor], {
    colorspace: "lch",
    // @ts-ignore:
    num: num * 2,
    tokenOptions: options?.tokenOptions,
    // @ts-ignore:
  }).slice(0, num);
}
