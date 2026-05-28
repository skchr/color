import { max, min } from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type { ColorToken } from "../types.d.ts";
import { averageNumber, random } from "culori/fn";

/**
 * Returns a random pastel variant of the passed in color token.
 *
 *   
 * Pastel colors are those soft hued colors like baby blue,pink and mauve.
 *
 *  
 *
 * @param {ColorToken} [baseColor] - The color to return a pastel variant of.
 * @returns {ColorToken} - A random pastel variant of the input color.
 * @example
 *
import { pastel } from '@skchr/color'

console.log(pastel("green"))

// #036103ff
 */
export default function pastel(baseColor?: ColorToken): ColorToken {
  const w = [
      [0.3582677165354331, 0.996078431372549, 16538982.504333857],
      [0.4395161290322581, 0.9725490196078431, 15694401.836627495],
      [0.472, 0.9803921568627451, 15986490.838712374],
      [0.3305785123966942, 0.9490196078431372, 14834893.772825705],
      [0.2992125984251969, 0.996078431372549, 7446012.731034764],
      [0.38818565400843885, 0.9294117647058824, 8247112.202928809],
    ],
    [u, v] = [w.map((o) => o[0]), w.map((o) => o[1])];

  const t = {
    ms: averageNumber(u),
    ml: averageNumber(v),
    mns: min(u),
    mxs: max(u),
    mnv: min(v),
    mxv: max(v),
  };
  // @ts-ignore:

  const q = random("hsv", {
    s: [t.mns, t.mxs],
    v: [t.mnv, t.mxv],
    // @ts-ignore:
    h: token(baseColor, { targetMode: "hsv", kind: "obj" }).h,
  });

  return q;
}
