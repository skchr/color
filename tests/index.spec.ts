// @ts-nocheck

import { test, expect } from "bun:test";
import {
  contrast,
  deficiency,
  distribute,
  sortBy,
  filterBy,
  stats,
  discover,
  colors,
  earthtone,
  hueshift,
  interpolator,
  pair,
  pastel,
  scheme,
  diverging,
  nearest,
  achromatic,
  alpha,
  family,
  lightness,
  luminance,
  mc,
  temp,
  token,
} from "../lib";
type Spec = {
  description: string;

  callback: any;
  params: unknown[];
};
const str = "#ffc3b03b",
  arr = ["rgb", 0.4, 0.3, 0.1, 0.7],
  obj = { r: 0.2, g: 0.4, b: 0.5, mode: "rgb" },
  fn_mc = (a: string, b: string, c: number | string) => mc(a)(b, c);

const samples = colors("all", "500");
const specs = [
  {
    description: "Calculates the contrast between two colors",
    params: ["blue", "red"],
    callback: contrast,
  },
  {
    description: "Simulates color vision deficiency",
    params: ["cyan", { kind: "green", severity: 0.6 }],
    callback: deficiency,
  },

  {
    description: "Filters collections of color.",
    callback: filterBy,

    params: [
      samples,
      {
        ranges: { hue: [">=190"] },
        factor: ["hue"],
      },
    ],
  },
  {
    description: "Sorts collections of color.",
    callback: sortBy,

    params: [samples, { factor: ["hue"], order: "asc" }],
  },
  {
    description: "Gets the stats for a collection of color.",
    callback: stats,

    params: [samples],
  },
  {
    description: "Distributes factors of a collection of color.",
    callback: distribute,
    params: [samples, { factor: ["chroma"], extremum: "max" }],
  },

  {
    description: "Discovers palette combinations from an array of colors",
    callback: discover,
    params: [],
  },
  {
    description:
      "Creates a color scale between an earth tone and any color token using spline interpolation.",
    callback: earthtone,
    params: [],
  },
  {
    description:
      "Creates a palette of hue shifted colors from the passed in color.",
    callback: hueshift,
    params: [],
  },
  {
    description:
      "Interpolates the passed in colors and returns a color scale that is evenly split into `num` amount of samples.",
    callback: interpolator,
    params: [],
  },
  {
    description:
      "Creates a palette that consists of a `baseColor` that is incremented by a `hueStep` to get the final color to pair with.",
    callback: pair,
    params: [],
  },
  {
    description:
      "Generates a randomised classic color scheme from the passed in color.",
    callback: pastel,
    params: [],
    result: "",
  },
  {
    description: "Distributes factors of a collection of color.",
    callback: scheme,
    params: [],
  },
  {
    description: "Returns an array of diverging colors",
    callback: diverging,
    params: ["Spectral"],
  },
  {
    description: "Returns an array of colors from Tailwind",
    callback: colors,
    params: ["red"],
  },
  {
    description:
      "Gets the nearest colors in a collection as compared against a comparison color",
    callback: nearest,
    params: [colors("all", "600"), { num: 6, against: "yellow" }],
  },

  {
    description: "converts an object to a number",
    callback: token,
    params: [obj, { kind: "num" }],
  },
  {
    description: "converts a hex string to an array of channel values",
    callback: token,
    params: [str, { kind: "arr", targetMode: "lab" }],
  },
  {
    description:
      "converts an array to a 6 character hex string (without the alpha channel). ",
    callback: token,
    params: [arr, { kind: "str", omitAlpha: true }],
  },
  {
    description:
      "converts an array to an object without alpha and mode properties",
    callback: token,
    params: [arr, { kind: "obj", omitMode: true, omitAlpha: true }],
  },
  {
    description:
      "converts an object to an array of channel values with no mode string.",
    callback: token,
    params: [obj, { kind: "arr", omitMode: true }],
  },
  {
    description: "converts an array to a number",
    params: [arr, { kind: "num" }],
    callback: token,
  },

  {
    description: "gets the channel value of a color object",
    callback: fn_mc,
    params: ["lch.c", obj],
  },
  {
    description: "gets the channel value of color array",
    callback: fn_mc,
    params: ["lch.c", arr],
  },
  {
    description: "gets the channel value of color string",
    callback: fn_mc,
    params: ["lch.c", str],
  },

  {
    description: "sets the channel value of a color object",
    callback: fn_mc,
    params: ["lch.h", obj, "*0.2"],
  },

  {
    description: "sets the channel value of a color array",
    callback: fn_mc,
    params: ["lch.h", arr, 20],
  },

  {
    description: "sets the alpha channel value on a color object",
    callback: alpha,
    params: [obj, 0.05],
  },
  {
    description: "sets the alpha channel value on a color string",
    callback: alpha,
    params: [str, 0.05],
  },
  {
    description: "sets the alpha channel value on a color array",
    callback: alpha,
    params: [arr, 0.05],
  },

  {
    description: "gets the alpha channel value from a color object",
    callback: alpha,
    params: [obj],
  },
  {
    description: "gets the alpha channel value from a color array",
    callback: alpha,
    params: [arr],
  },
  {
    description: "gets the alpha channel value from a color string",
    callback: alpha,
    params: [str],
  },

  {
    description: "gets the hue family of a color token",
    params: [str, true],
    callback: family,
  },

  {
    description: "gets the estimated color temperature of a color token",
    params: [str],
    callback: temp,
  },

  // ? achromatic
  {
    description: "checks if a color is grayscale or not",
    params: ["gray"],
    callback: achromatic,
  },

  // ? lightness
  {
    description:
      "brightens or darkens the color by scaling the lightness channel",
    params: [obj, { amount: 0.3, darken: true }],
    callback: lightness,
  },
  // ? luminance

  // * setting
  {
    description: "gets the luminance value of the passed in color token",
    params: [obj],
    callback: luminance,
  },

  {
    description: "sets the luminance value of the passed in color token",
    params: [str, 0.5],
    callback: luminance,
  },
] as Spec[];

function runner(specs: Spec[]) {
  for (const spec of specs) {
    console.info(`${spec?.description} \n`);
    test(spec.description, () => {
      expect(spec.callback(...spec?.params)).toBeTruthy();
    });
  }
}

runner(specs);
