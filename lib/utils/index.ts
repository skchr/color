import {
  colorsNamed,
  formatHex,
  formatHex8,
  modeHsv,
  modeLab,
  modeLab65,
  modeLch,
  modeLch65,
  modeLrgb,
  modeRec2020,
  modeXyz50,
  modeXyz65,
  useMode,
  wcagLuminance,
} from "culori/fn";
import "culori/css";
import {
  and,
  eq,
  exprParser,
  floorCeil,
  getSrcMode,
  give,
  gmchn,
  gt,
  gte,
  inRange,
  isArray,
  lte,
  max,
  min,
  or,
} from "../internal/index.ts";
import { hue } from "../constants/index.ts";
import type {
  BiasedHues,
  ColorFamily,
  ColorToken,
  ColorTuple,
  LightnessOptions,
  TokenOptions,
} from "../types.d.ts";
import { interpolator } from "../generators/index.ts";

/**
 *
 * Sets and retrieves the color token's alpha (or opacity).
 *
 *  If the the `amount` argument is passed in, it sets the color token's alpha channel with the `amount` specified
 * and returns the color as a hex string.
 *
 *   
 *
 * * Also supports math expressions as a `string` for the `amount` parameter.
 * For example `*0.5` which means the value mult ly the current alpha by `0.5` and set the product as the new alpha value.
 * In short `currentAlpha * 0.5 = newAlpha`. The supported symbols are `*  -  /  +`.
 *
 *  
 *
 * If the `alpha` channel is `undefined`, it defaults to `1`.
 *
 * @param {ColorToken} color - The color with the opacity/alpha channel to retrieve or set.
 * @param {Amount} [amount] - The value to apply to the opacity channel. The value is between `[0,1]`.
 * @returns {Amount extends undefined ? number : ColorToken} - The alpha channel value if `amount` is omitted, or the color token with the new alpha if `amount` is provided.
 * @example
  import { alpha } from '@skchr/color'

 // Getting the alpha
console.log(alpha('#a1bd2f0d'))
// 0.050980392156862744

// Setting the alpha 

const myColor = alpha('b2c3f1', 0.5)

console.log(myColor)

// #b2c3f180
 */

function alpha<Amount>(
  color: ColorToken = "cyan",
  amount: Amount | undefined = undefined,
): Amount extends undefined ? number : ColorToken {
  // @ts-ignore:
  let alphaChannel: number,
    len: number,
    hasMode: string | undefined,
    hasAlpha: boolean,
    alphaIdx: number;

  if (isArray(color))
    //  @ts-ignore:

    [len, hasMode, hasAlpha, alphaIdx, alphaChannel] = [
      (color as ColorTuple).length,
      (color as ColorTuple).find((c) => eq(typeof c, "string")),
      (color as ColorTuple).filter((channel) => eq(typeof channel, "number"))
        .length === 4,

      //  @ts-ignore:

      hasAlpha ? len - 1 : hasMode ? 4 : 3,
      color[alphaIdx],
    ];

  if (eq(typeof color, "string"))
    alphaChannel =
      gte((color as ColorTuple)?.length, 8) &&
      // @ts-ignore:
      !colorsNamed[(color as string).toLowerCase()]
        ? Number.parseInt(
            (color as string)?.slice((color as string)?.length - 2),
            16,
          ) / 255
        : 1;
  // @ts-ignore:
  if (typeof color === "object" && !len)
    // @ts-ignore:
    alphaChannel = color?.alpha;

  //  if amount is undefined, return the alpha channel
  if (typeof amount === "undefined")
  return typeof alphaChannel === "number" ? alphaChannel : 1;

  switch (typeof amount) {
    case "number":
      // @ts-ignore:
      amount = (inRange(amount, 0, 1) && amount) || give(amount, 100);
      break;
    // @ts-ignore:
    case "string":
      amount = exprParser(alphaChannel, amount);
  }

  if (isArray(color))
    // @ts-ignore:
    color[alphaIdx] = amount;

  // @ts-ignore:
  if (typeof color === "object" && !len)
    // @ts-ignore:
    color.alpha = amount;
  if (typeof color == "number" || typeof color == "string") {
    const colorObject = token(color, { kind: "obj" });
    // @ts-ignore:
    colorObject.alpha = amount;
    color = colorObject as ColorToken;
  }
  // @ts-ignore:
  return color;
}

/**
 * Sets the value of the specified channel on the passed in color.
 *
 * If the `amount` parameter is `undefined` it gets the value of the specified channel.
 * @param  modeChannel The mode and channel to be retrieved. For example `'rgb.b'` will return the value of the blue channel in the RGB color space of that color.

 * @example

 * import { mc } from '@skchr/color'

console.log(mc('rgb.g')('#a1bd2f'))
// 0.7411764705882353
 *
*/

function mc(modeChannel = "") {
  /**

   * @param  color Any recognizable color token.
  * @param The value to set on the queried channel. Also supports expressions as strings e.g `"#fc23a1"` `"*0.5"`


   */
  return <Value extends unknown>(
    color?: ColorToken,
    value?: Value,
  ): Value extends number ? ColorToken : number => {
    const [mode, channel] = modeChannel.split(".");

    // @ts-ignore:
    const colorObject = token(color, { targetMode: mode, kind: "obj" });
    // @ts-ignore:
    const currentChannel: number = colorObject[channel];

    if (typeof value != "undefined")
      // @ts-ignore:
      colorObject[channel] =
        (typeof value === "number" &&
          // @ts-ignore:
          value) ||
        exprParser(colorObject[channel], value);
    // @ts-ignore:
    return (value && colorObject) || currentChannel;
  };
}

/**
 * Checks if a color token is achromatic (without hue or simply grayscale).
 *
 * @param {ColorToken} color - The color token to test if it is achromatic or not.
 * @returns {boolean} - Whether the color is achromatic (without hue or grayscale).
 * @example

import { achromatic } from "@skchr/color";
S
 achromatic('pink')
// false

let sample = [
  "#164100",
  "#ffff00",
  "#310000",
  'pink'
];

console.log(sample.map(achromatic));

// [false, false, false,false]

achromatic('gray')
// Returns true

// We can expand this example by interpolating between black and white and then getting some samples to iterate through.

import { interpolator } from "@skchr/color"

// we create an interpolation using black and white with 12 samples
let grays = interpolator(["black", "white"],{ num:12 });

console.log(grays.map(achromatic));

//
 [false, true, true,
  true,  true, true,
  true,  true, true,
  true,  true, false
]

 */
function achromatic(color: ColorToken): boolean {
  // @ts-ignore:
  color = token(color, { kind: "obj", targetMode: "lch" });

  // If a color has no lightness then it has no hue
  // so its technically not achromatic since white and black are not grayscale
  // @ts-ignore:
  const isFalsy = (x: any) =>
    typeof x === "undefined" || Math.floor(x) === 0 || Number.isNaN(x);

  // @ts-ignore

  if (color.l <= 0 || color.l >= 100 || isFalsy(color.c)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Darkens the color by reducing the `lightness` channel by `amount` of the channel. For example `0.3` means reduce the lightness by `0.3` of the channel's current value.
 * @param {ColorToken} color - The color to darken or lighten.
 * @param {LightnessOptions} options - Specify options such as whether to darken or highlight.
 * @returns {ColorToken} - The darkened or lightened color token.
 * @example
 *
 *  import { lightness } from "@skchr/color";
 *
 // darkening a color
console.log(lightness('blue', 0.3, true));

// '#464646'

// brightening a color, we can omit the final param
// because it's false by default.
console.log(brighten('blue', 0.3));
//#464646


 */
function lightness(color: ColorToken, options?: LightnessOptions): ColorToken {
  let { amount, darken } = options || ({} as LightnessOptions);

  amount = amount || 0.1;
  darken = darken || false;
  const f = () => {
    const colorObject = token(color, { kind: "obj", targetMode: "lab" });
    if (amount)
      // @ts-ignore:
      colorObject.l = (darken ? max : min)([
        100,
        // @ts-ignore:
        colorObject.l + 100 * (darken ? -amount : amount),
      ]);

    // @ts-ignore:
    return token(colorObject);
  };
  // @ts-ignore:
  return f();
}

/**
 * Parses any recognizable color to the specified `kind`.
 *
 * The `kind` option supports the following types as options (case-insensitive):
 *
 * * `'arr'` - Parses the color token to an array of channel values with the `colorspace` as the first element if the `omitMode` parameter is set to `false` in the `options` object.
 *
 * * `'num'` - Parses the color token to its numerical equivalent to a number between `0` and `16,777,215`.
 *
 * The `numberType` can be used to specify which type of number to return if the `kind` option is set to `'num'`:
 *  - `'hex'` - Hexadecimal number
 *  - `'bin'` - Binary number
 *  - `'oct'` - Octal number
 *  - `'expo'` - Decimal exponential notation
 *
 *  - `'str'` - Parses the color token to its hexadecimal string equivalent.
 *
 *  - `'obj'` - Parses the color token to a plain color object in the `mode` specified by the `targetMode` parameter in the `options` object.t
 *
 *   
 *
 *  If the color token has an explicit `alpha` (specified by the `alpha` key in color objects and as the fourth and last number in a color array) the string will be 8 characters long instead of 6.

 *
 *  
 * @param {ColorToken} color - The color token to parse or convert.
 * @param {TokenOptions} [options] - Options to customize the parsing and output behaviour.
 * @returns {ColorToken} - The parsed or converted color token in the specified format.
 */
function token(color: ColorToken = "cyan", options?: TokenOptions): ColorToken {
  // the mode definitions
  const modeDefinitions = {
    lrgb: modeLrgb,
    lab: modeLab,
    lch65: modeLch65,
    lch: modeLch,
    xyz: modeXyz50,
    xyz65: modeXyz65,
    lab65: modeLab65,
    rgb: modeRec2020,
    hsv: modeHsv,
  };
  let {
    srcMode,
    targetMode,
    omitMode,
    kind,
    numType,
    omitAlpha,
    normalizeRgb,
  } = options || {};

  // Always handle defaults internally because if some property is not specified it will be null
  normalizeRgb = normalizeRgb || false;
  numType = numType || undefined;
  omitAlpha = omitAlpha || false;
  kind = (kind || "str")?.toLowerCase() as typeof kind;
  omitMode = omitMode || false;
  srcMode = (srcMode && srcMode) || getSrcMode(color as ColorToken);

  /**
   * An array of channel keys from the source colorspace. If undefined it defaults to 'rgb'
   */
  let srcChannels = gmchn(srcMode) as string[],
    /**
     * an array of channel values
     */
    srcChannelValues: number[];
  /**
   * the alpha channel captured if it exists in the color token
   */
  const alphaValue = (() => {
    if (isArray(color)) {
      const nums = (color as ColorTuple).filter(
        (c) => typeof c === "number",
      );
      return nums.length === 4 ? (nums[3] as number) : 1;
    }
    if (typeof color === "string") {
      return (color as string).length >= 8 &&
        !colorsNamed[(color as string).toLowerCase()]
        ? Number.parseInt((color as string).slice(-2), 16) / 255
        : 1;
    }
    if (typeof color === "object" && color !== null && !("length" in color)) {
      return (color as Record<string, unknown>)?.alpha ?? 1;
    }
    return 1;
  })();
  let result: { [x: string]: number | string } = {};
  result.mode = srcMode;
  // Get the channels from passed in color token
  // if the color token is a string or number we just convert it to an object

  if (isArray(color))
    // @ts-ignore:
    srcChannelValues = (color as ColorTuple).filter((a) =>
      eq(typeof a, "number"),
    );

  // @ts-ignore: check if it does not have a length as well
  if (eq(typeof color, "object") && !color?.length)
    // @ts-ignore:
    srcChannelValues = srcChannels.map((a) => color[a]);

  if (eq(typeof color, "string"))
    // @ts-ignore:
    result = parseToken(c2str(), "rgb");

  // @ts-ignore:
  if (srcChannelValues)
    for (const channel of srcChannels)
      result[channel] = srcChannelValues[srcChannels.indexOf(channel)];

  if (srcMode === "rgb" && normalizeRgb)
    if (srcChannels.some((c) => Math.abs(result[c] as number) > 1))
      // @ts-ignore:
      for (const k of srcChannels) (result[k] as number) /= 255;

  if (targetMode) result = parseToken(result, targetMode);

  function parseToken(col: unknown, mode?: unknown) {
    // @ts-ignore:
    return useMode(modeDefinitions[mode])(or(col, result));
  }
  /**
   * converts any color token to an array or object equivalent
   */
  function c2col(col: "obj" | "arr") {
    const res = (targetMode && parseToken(result, targetMode)) || result;

    if (targetMode)
      // 🖕🏿
      srcChannels = gmchn(targetMode) as string[];

    if (eq(col, "obj")) {
      omitMode
        ? // @ts-ignore:
          delete res.mode
        : // @ts-ignore:
          (res.mode = (targetMode && targetMode) || srcMode);

      // @ts-ignore:
      omitAlpha ? delete res.alpha : (res.alpha = alphaValue);
      return res;
    }

    if (eq(col, "arr")) srcChannelValues = [];
    for (const k of srcChannels) {
      // @ts-ignore:
      srcChannelValues[srcChannels.indexOf(k)] = res[k];
    }

    // @ts-ignore:
    omitAlpha ? srcChannelValues : srcChannelValues.push(alphaValue);
    omitMode
      ? srcChannelValues
      : // @ts-ignore:
        srcChannelValues.unshift(targetMode ? targetMode : srcMode);
    return srcChannelValues;
  }

  /**
   * converts a color token to its numerical equivalent
   */
  function c2num() {
    const rgbObject: object = parseToken(c2str(), "rgb");

    const result =
      // @ts-ignore:
      ((255 * rgbObject.r) << 16) +
      // @ts-ignore:
      ((255 * rgbObject.g) << 8) +
      // @ts-ignore:
      255 * rgbObject.b;

    return (
      (numType &&
        result.toString(
          {
            bin: 2,
            hex: 16,
            expo: 6,
            oct: 8,
          }[numType?.toLowerCase() as string],
        )) ||
      result
    );
  }

  /**
   * converts any color token to hexadecimal
   */
  function c2str() {
    // @ts-ignore:
    return {
      boolean: or(and(eq(color, true), "#ffffff"), "#000000"),
      number: num2c(),
      // @ts-ignore:
      object: (omitAlpha ? formatHex : formatHex8)(c2col("obj")),
      // @ts-ignore:
      string: formatHex(color),
    }[typeof color];
  }

  /**
   * converts a number to an RGB color object
   */
  function num2c() {
    // Ported from chroma-js with slight modifications

    return (eq(typeof color, "number"), gte(color as number, 0)) &&
      lte(color as number, 0xffffff)
      ? {
          r: ((color as number) >> 16) / 255,

          g: (((color as number) >> 8) & 0xff) / 255,

          b: (color as number & 0xff) / 255,
          mode: "rgb",
        }
      : Error(`unknown num color:   ${color}`);
  }

  return {
    obj: c2col("obj"),
    arr: c2col("arr"),
    str: c2str(),
    num: c2num(),
  }[kind as string];
}

/**
 * Sets/Gets the luminance of the passed in color token.
 *
 * If the `amount` argument is passed in, it will adjust the luminance by interpolating the color with black (to decrease luminance) or white (to increase the luminance) by the specified `amount`.
 * 
 * If the `amount` argument is not passed in however, it will simply return the color token's luminance.
 * @param {ColorToken} color - The color to retrieve or adjust luminance.
 * @param {number} [amount] - The amount of luminance to set. The value range is normalised between [0,1].
 * @returns {Amount extends number ? ColorToken : number} - The luminance value if `amount` is omitted, or the color token with the new luminance if `amount` is provided.
 * @example
 *
 * import { luminance } from '@skchr/color'

// Getting the luminance

console.log(luminance('#a1bd2f'))
// 0.4417749513730954

console.log(colors('all', '400').map((c) => luminance(c)));

// [
   0.3595097699638928,  0.3635745068550118,
   0.3596908494424909,  0.3662525955988395,
  0.36634113914916244, 0.32958967582076004,
  0.41393242740130043,  0.5789820793721787,
   0.6356386777636567,  0.6463720036841869,
   0.5525691083297639,  0.4961850321908156,
   0.5140644334784611,  0.4401325598899415,
  0.36299191043315415,  0.3358285501372504,
  0.34737270839643575, 0.37670102542883394,
   0.3464512307705231, 0.34012939384198054
]

// setting the luminance

let myColor = luminance('#a1bd2f', 0.5)

console.log(luminance(myColor))
// 0.4999999136285792
 */
function luminance<Amount>(
  color?: ColorToken,
  amount: number | undefined = undefined,
): Amount extends number ? ColorToken : number {
  color = token(color, { kind: "obj", srcMode: "rgb" });

  // @ts-ignore:
  let result: unknown;
  if (typeof amount === "undefined")
    // @ts-ignore:
    return wcagLuminance(color);

  const w = "#ffffff",
    b = "#000000";

  const EPS = 1e-7;
  let MAX_ITER = 20;

  if (eq(typeof amount, "number")) {
    const currentLuminance = wcagLuminance(color as string);

    //Must add the overrides object to change parameters like easings, fixups, and the mode to perform the computations in.
    // use a bilinear interpolation
    // @ts-ignore:
    const f = (u, v) => {
      // @ts-ignore:
      const [mid, low] = interpolator([u, v], { num: 2 });
      // @ts-ignore:

      // @ts-ignore:
      if (Math.abs(amount - low > EPS) || !MAX_ITER--)
        // close enough
        return mid;

      if (gt(low, amount)) return f(u, mid);

      return f(mid, v);
    };

    if (gt(currentLuminance, amount)) result = f(b, color);
    else result = f(color, w);
  }
  // @ts-ignore:
  return token(result);
}

/**
 * Returns the hue family which the passed in color belongs to with the "overtone" included (if it has one.).
 *
 * For example `'red'` or `'blue-green'`. If the color is achromatic it returns the string `'gray'`.
 * @param {ColorToken} color The color to query its shade or hue family.
 * @param {boolean} bias Returns the name of the hue family which is biasing the passed in color using the `'lch'` colorspace. If it has no bias it returns `false` on the `bias` property of the returned object.
 * @returns {string | { bias: string | false; family: string }} The hue family name, or an object with the family and its bias.
 *
 * @example
 *
 * import { family } from '@skchr/color'


console.log(family("#310000"))

// 'red'
 */
function family(
  color: ColorToken,
  bias = false,
):
  | (BiasedHues & ColorFamily)
  | {
      hue: BiasedHues & ColorFamily;
      bias: false | ColorFamily;
    } {
  // @ts-ignore:
  const res =
    (!achromatic(color) &&
      hue.find((arr) => {
        // @ts-ignore:
        const hueRanges = arr.slice(1).flat(1) as number[];

        return inRange(mc("lch.h")(color), min(hueRanges), max(hueRanges));
      })?.[0]) ||
    "gray";

  // @ts-ignore:
  return (
    (bias && {
      hue: res,
      bias: (/-/.test(res) && res.split("-")[1]) || false,
    }) ||
    res
  );
}

/**
 * Returns a rough estimation of a color's temperature as either `'cool'` or `'warm'` using the `'lch'` colorspace.
 *
 * @param {ColorToken} color - The color to check the temperature.
 * @returns {"cool" | "warm"} - Whether the color is warm or cool.
 * @example
 *
 * import { temp } from '@skchr/color'

let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000"
];


console.log(temp(sample[2]));
// 'cool'

console.log(map(sample, temp));

// [ 'cool',  'warm', 'cool']



 */
function temp(color: ColorToken = "cyan"): "cool" | "warm" {
  return (
    (hue.some((arr) =>
      inRange(
        floorCeil(mc("lch.h")(color)),
        // @ts-ignore:
        arr[2][0],
        // @ts-ignore:
        arr[2][1],
      ),
    ) &&
      "cool") ||
    "warm"
  );
}

export { achromatic, alpha, family, lightness, luminance, mc, temp, token };
