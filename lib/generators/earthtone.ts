import { or } from "../internal/index.ts";
import type { ColorToken, EarthtoneOptions } from "../types.d.ts";
import interpolator from "./interpolator.ts";
/**
 * Creates a color scale between an earth tone and any color token using spline interpolation.
 * @param {ColorToken} baseColor - The color to interpolate an earth tone with.
 * @param {EarthtoneOptions} [options] - Optional overrides for customising interpolation and easing functions.
 * @returns {ColorToken | Array<ColorToken>} - The interpolated earth tone color(s).
 * @example
 *
 * import { earthtone } from '@skchr/color'


console.log(earthtone("pink",'lch',{earthtones:'clay',samples:5 }))
// [ '#6a5c52', '#8d746a', '#b38d86', '#d9a6a6', '#ffc0cb' ]

 */
export default function earthtone(
  baseColor: ColorToken = "cyan",
  options: EarthtoneOptions = {},
): ColorToken | Array<ColorToken> {
  let { num, earthtones, colorspace, kind, closed } = options;

  earthtones = or(earthtones, "dark");
  const earthtoneSamples = {
    "light-gray": "#e5e5e5",
    silver: "#f5f5f5",
    sand: "#c2b2a4",
    tupe: "#a79e8a",
    mahogany: "#958c7c",
    "brick-red": "#7d7065",
    clay: "#6a5c52",
    cocoa: "#584a3e",
    "dark-brown": "#473b31",
    dark: "#352a21",
  };
  const currentEarthtone = earthtoneSamples[earthtones.toLowerCase()];

  return interpolator([currentEarthtone, baseColor], {
    colorspace: colorspace,
    num: num,
    closed: closed,
    kind: kind,
    tokenOptions: options?.tokenOptions,
  });
}
