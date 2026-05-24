import { lte, or, adjustHue, ef } from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type { Collection, ColorToken, HueshiftOptions } from "../types.d.ts";

/**
 * Creates a palette of hue shifted colors from the passed in color.
 *
 *
 * Hue shifting means that:
 *
 * * As a color becomes lighter, its hue shifts up (increases).
 * * As a color becomes darker its hue shifts down (decreases).
 *
 * The `minLightness` and `maxLightness` values determine how dark or light our color will be at either extremum respectively.'
 *
 *
 *  The length of the resultant array is the number of samples (`num`) mult lied by 2 plus the base color passed in or simply `(num * 2) + 1`.
 *
 * @param baseColor The color to use as the base of the palette.
 * @param options The optional overrides object.

 * @example
 * import { hueshift } from "@prjctimg/huetiful";

let hueShiftedPalette = hueShift("#3e0000");

console.log(hueShiftedPalette);

// [
  '#ffffe1', '#ffdca5',
  '#ca9a70', '#935c40',
  '#5c2418', '#3e0000',
  '#310000', '#34000f',
  '#38001e', '#3b002c',
  '#3b0c3a'
]
 */
export default function hueshift(
  baseColor?: ColorToken,
  options: HueshiftOptions = {},
): Collection {
  let { num, hueStep, minLightness, maxLightness, easingFn, tokenOptions } = or(
    options,
    {},
  ) as HueshiftOptions;

  easingFn = or(easingFn, ef);
  // @ts-ignore:
  num = or(num, 6) + 1;
  hueStep = or(hueStep, 5);
  baseColor = token(baseColor, {
    kind: "obj",
    targetMode: "lch",
  }) as ColorToken;
  const z = [baseColor];

  // // if value is beyond max normalize all the values ensuring that the end is higher than start
  // // and that if minval was less than max range we will get that channel's equivalent value on the [0,100] scale.

  // @ts-ignore:
  maxLightness = lte(maxLightness, 95) ? maxLightness : 90;
  // @ts-ignore:
  minLightness = lte(minLightness, maxLightness) ? minLightness : 5;

  /**
   * @internal
   * Normalizes any value in the range [0,1] to the ranges supported by the colorspace
   */
  const f = (i: number, e1: number, e2: number) =>
    Math.abs(
      // @ts-ignore:
      ((i - 0) / (e1 - 0)) * (e2 - baseColor?.l) + baseColor?.l,
    );

  // Maximum number of iterations possible.
  //Each iteration add a darker shade to the start of the array and a lighter tint to the end.

  for (let i = 1, j = i / num; i < num; i++) {
    //adjustHue checks hue values are clamped.
    // Here we use lightnessMapper to calculate our lightness values which takes a number that exists in range [0,1].
    const [y, x] = [
      {
        // @ts-ignore:
        l: f(i, num, minLightness),
        // @ts-ignore:
        c: baseColor?.c,
        // @ts-ignore:
        h: adjustHue(baseColor.h - hueStep * easingFn(j)),
        mode: "lch",
      },
      {
        // @ts-ignore:
        l: f(i, num, maxLightness),
        // @ts-ignore:
        c: baseColor?.c,
        // @ts-ignore:
        h: adjustHue(baseColor.h + hueStep * easingFn(j)),
        mode: "lch",
      },
    ];

    z.push(x as ColorToken);
    z.unshift(y as ColorToken);
  }

  return Array.from(new Set(z)).map((c) => token(c, tokenOptions));
}
