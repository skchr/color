import {
  gt,
  gte,
  li,
  mcchn,
  or,
  values,
  hi,
  and,
  ci,
  ef,
} from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type {
  Collection,
  ColorToken,
  InterpolatorOptions,
} from "../types.d.ts";
import {
  interpolatorSplineBasisClosed,
  interpolatorSplineBasis,
  interpolatorSplineNaturalClosed,
  interpolatorSplineNatural,
  interpolatorSplineMonotoneClosed,
  interpolate,
  interpolatorSplineMonotone,
  samples,
  fixupHueLonger,
  fixupHueShorter,
} from "culori/fn";

/**
 * Interpolates the passed in colors and returns a color scale that is evenly split into `num` amount of samples.
 *
 * The interpolation behaviour can be overidden allowing us to get slightly different effects from the same `baseColors`.
 *
 * The behaviour of the interpolation can be customized by:
 *
 * * Changing the `kind` of interpolation
 *
 * 	* natural
 * 	* basis
 * 	* monotone
 * * Changing the easing function (`easingFn`)
 *
 * * To create a color scale for cyclic values pass `true` to the `closed` parameter in the `options` object.
 * * If `num` is 1 then a single color is returned from the resulting interpolation with the internal `t` value at `0.5` else a collection of the `num` of color scales is returned.
 * * If the collection of colors contains an achromatic color, the resulting samples may all be grayscale or pure black.
 *
 * @param baseColors The collection of colors to interpolate. If a color has a falsy channel for example black has an undefined hue channel some interpolation methods may return NaN affecting the final result or making all the colors in the resulting interpolation gray.
 * @param  options Optional overrides to customize parameters such as interpolation methods and per channel eeasings.
 * @returns 
 *
 * @example
 *
 * import { interpolator } from '@prjctimg/huetiful';

console.log(interpolator(['pink', 'blue'], { num:8 }));

// [
  '#ffc0cb', '#ff9ebe',
  '#f97bbb', '#ed57bf',
  '#d830c9', '#b800d9',
  '#8700eb', '#0000ff'
]
 *
 */
export default function interpolator(
  baseColors: Collection = [],
  options: InterpolatorOptions = {},
): Array<ColorToken> | ColorToken {
  let { hueFixup, stops, easingFn, kind, closed, colorspace, num } =
    options || {};
  // Set the internal defaults
  easingFn = or(easingFn, ef);
  kind = or(kind, "basis");
  num = or(num, 1);
  // @ts-ignore:
  hueFixup = hueFixup === "shorter" ? fixupHueShorter : fixupHueLonger;
  const method = {
    basis: or(
      and(closed, interpolatorSplineBasisClosed),
      interpolatorSplineBasis,
    ),
    natural: or(
      and(closed, interpolatorSplineNaturalClosed),
      interpolatorSplineNatural,
    ),
    monotone: or(
      and(closed, interpolatorSplineMonotoneClosed),
      interpolatorSplineMonotone,
    ),
  }[kind as string];

  const len = stops?.length as number;

  const data = gt(len, 0)
    ? // @ts-ignore:
      values(baseColors)
        ?.slice(0, len - 1)
        .map((c, i) => [c, stops[i]])
        .concat(values(baseColors).slice(len))
    : values(baseColors);

  // @ts-ignore:
  const func = interpolate([...data, easingFn], colorspace, {
    // @ts-ignore:
    h: {
      fixup: hueFixup,
      use: or(method, hi),
    },
    [mcchn("l", colorspace, false)]: {
      use: or(method, li),
    },
    [mcchn("c", colorspace, false)]: {
      use: or(method, ci),
    },
  });

  // make sure samples is an absolute integer
  // @ts-ignore:
  num = or(and(gte(num, 1), Math.abs(num)), 1);

  return or(
    and(
      gt(num, 1),
      //  @ts-ignore:
      samples(num).map((s) => token(func(s), options?.tokenOptions)),
    ),
    // @ts-ignore:
    token(func(0.5), options?.tokenOptions),
  );
}
