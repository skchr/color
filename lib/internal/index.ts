// deno-lint-ignore-file ban-ts-comment

import {
  differenceHyab,
  easingSmoothstep,
  fixupHueShorter,
  interpolatorLinear,
  interpolatorSplineBasisClosed,
  interpolatorSplineNatural,
} from "culori/fn";
import { mc } from "../utils/index.ts";

import { contrast } from "../accessibility/index.ts";
import type { hue } from "../constants/index.ts";
import type {
  Collection,
  Colorspaces,
  ColorToken,
  Factor,
  IdentityFunc,
} from "../types.d.ts";

const { keys, entries, values } = Object;

export const COLOR_SPACES: Array<Colorspaces> = [
  "lch",
  "lab",
  "rgb",
  "lch",
  "lch65",
  "xyz65",
  "xyz",
  "lrgb",
  "hsv",
];

/**
 *
 * Handles assigning the colorspace to work in by checking if the passed in colorspace is valid.
 * If a hue based colorspace is desired you can specify  `h` to be true. It will optionally check if the passed colorspace is hue based
 * and return a default `def` or `lch` if `def is not defined.`
 * @param cspace The colorspace passed in
 * @param h Whether or not a hue based colorspace is needed. Default is `false`
 * @param def The default value to return if a nonj compliant colorspace is specified.
 * If a non hue based default is specified with `h` set to true, it will default to 'lch'.
 * */
function initCspace(cspace?: string, h = false, def?: string) {
  const re = (x) => /h/gi.test(x);
  return (
    (COLOR_SPACES.includes(cspace?.toLowerCase() as Colorspaces) &&
      h &&
      ((re(cspace) && cspace) || (re(def) && def) || "lch")) ||
    def ||
    "rgb"
  );
}
const operators = {
  "!=": neq,
  "==": eq,
  ">=": gte,
  "<=": lte,
  ">": gt,
  "<": lt,
  "===": eq,
  "!==": neq,
  "!": not,
  "/": give,
  "*": mult,
  "+": add,
  "-": take,
};

/**
 * Returns the first truthy value.
 * @param  arg The value to check
 * @param def The value to cast if arg is falsy
 * @returns  The first truthy value
 */
function or<T, U>(arg: T, def: U): T | U {
  return arg || def;
}

/**
 * Logical AND expression for `a` and `b`.
 */
function and<T, U>(a: U, b: T) {
  return a && b;
}

/**
 * Fetche
 * @param a The color to compare against.
 * Its a string because Culori experts it to be a string or plain color object.
 */
const dstnce = (a: unknown) => (b: unknown) =>
  differenceHyab()(a as string, b as string);

/**
 * Helper func to return fact(s)
 * @param  t The factor array
 * @param {*} z callback that takes a factor as its only argument
 * @param y = Optional array of factor keys
 * @param [o=false] Used to specify whether to return an object with the factor key as wellor just an array of the color tokens
 */
function iterator(
  t: string[] | undefined,
  z: IdentityFunc,

  o = false,
  y = ["hue", "chroma", "lightness", "distance", "contrast", "luminance"],
) {
  const p = {};

  if (isArray(t) && t.length >= 1)
    // @ts-ignore:

    for (const k of values(t)) p[k] = z(k);

  // @ts-ignore:
  if (eq(t, undefined))
    // @ts-ignore:

    for (const k of y) p[k] = z(k);

  if (!o)
    // @ts-ignore:
    for (const k in p) {
      // @ts-ignore:

      for (const i in p[k]) {
        // @ts-ignore:
        p[k][i] = p[k][i]?.color;
      }
    }

  return p;
}

const [ci, ef, hf, hi, li] = [
  interpolatorSplineNatural,
  easingSmoothstep,
  fixupHueShorter,
  interpolatorSplineBasisClosed,
  interpolatorLinear,
];

function gmchn(m = "", i?: number) {
  const out = m.replace(/\d|ok/g, "");

  return or(and(i, out.charAt(i as number)), out.split(""));
}

function mult(x: number, y: number): number {
  return x * y;
}

function give(x: number, y: number): number {
  return x / y;
}

function add(x: number, y: number): number {
  return x + y;
}

function take(x: number, y: number): number {
  return x - y;
}

function exprParser(a: unknown, b: unknown) {
  if (typeof b !== "string") return a;
  const op = reOp(b) as string;
  const num = reNum(b);
  if (!op || !num) return a;
  // @ts-ignore:
  return operators[op](a, num);
}

/**
 * Gets the chroma or lightness channel from the specified `m` or colorspace.
 * @param  c The channel key to get
 * @param  m The colorspace
 * @param f Whether to return full mode channel string or key only
 * @returns
 */
function mcchn(c: "c" | "l" | string, m = "lch", f = true): string {
  // Matches any string with c or s

  let x: RegExp, e: string;

  if (eq(c, "l")) {
    x = /(j|l)/i;
    e = `The color space ${m} has no lightness channel.`;
  } else {
    x = /(s|c)/i;
    e = `The color space ${m} has no chroma/saturation channel.`;
  }
  // @ts-ignore
  const d = x.exec(m)["0"];

  // @ts-ignore
  return x.test(m) && or(and(f, `${m}.${d}`), d);
}

function colorObj(a: string, b: IdentityFunc) {
  // @ts-ignore
  return (c: ColorToken) => ({
    [a]: b(c),
    color: c,
  });
}

// customCConcat ???
// capture the amount of elements in hue
// for each element; slice the array from index 0 (the color family string index)
//
function customFindKey(u: typeof hue, v: number) {
  // If the color is achromatic return the string gray
  return keys(u)
    .filter((a) => {
      // @ts-ignore
      const t = customConcat(u[a]);

      // @ts-ignore
      const [mn, mx] = [min(...t), max(...t)];

      // Capture the min and max values and see if the passed in color is within that range
      return inRange(v, mn, mx);
    })
    .toString();
}

function adjustHue(val: number) {
  return ((val % 360) + 360) % 360;
}

function chnDiff(x?: ColorToken, s?: string) {
  return (y?: ColorToken) => {
    const cb = (c?: ColorToken) => mc(s)(c);

    return (lt(cb(x), cb(y)) && take(cb(y), cb(x))) || take(cb(x), cb(y));
  };
}

// Comparison operators

function gt(x: number, y: number) {
  return x > y;
}

function lt(x: number, y: number) {
  return x < y;
}

function gte(x: number, y: number) {
  return x >= y;
}

function lte(x: number, y: number) {
  return x <= y;
}

function eq(x: unknown, y: unknown) {
  return x === y;
}

function neq(x: unknown, y: unknown) {
  return not(eq(x, y));
}

function not(x: unknown) {
  return !x;
}
function inRange(n: number, s: number, e?: number) {
  // @ts-ignore:
  return and(
    // @ts-ignore:
    gte(n, Math.min(s, e)),
    // @ts-ignore:
    lt(n, Math.max(s, e)),
  );
}

function isInt(n: number): boolean {
  return /^-?[0-9]+$/.test(n.toString());
}

function rand(mn: number, mx: number) {
  return Math.random() * Math.abs(mx - mn + mn);
}

function floorCeil(n: number) {
  return and(
    not(isInt(n)),
    or(
      and(
        eq(/^[0-4]$/.test(n.toString().split(".")[1].charAt(0)), true),
        Math.floor(n),
      ),
      Math.ceil(n),
    ),
  );
}

/**
 * @param o The order to return the results in.
 * @param x The factor to sort with. Used as a key.
 */
function customSort(o = "asc", x = "factor") {
  // a-b gives asc order & b-a gives desc order
  type x = { [x: string]: number };
  //  @ts-ignore
  return (a: x, b: x) =>
    or(
      and(eq(o, or("asc", "min")), a[x] - b[x]),
      and(eq(o, or("desc", "max")), b[x] - a[x]),
    );
}

function colorObjColl(a: Factor, b: (x: unknown) => unknown) {
  return (z: unknown) => map(z, colorObj(a, b));
}

/**
 * Checks if value is an array.
 * @param {any} x The value to check.
 */
function isArray(x: unknown) {
  return Array.isArray(x);
}

/**
 * Checks if the value is an instance of a `Map`.
 * @param {any} x The value to check.
 */
function isMap(x: unknown): boolean {
  return x instanceof Map;
}

/**
 * Checks if the value is an instance of a `Set`.
 * @param {any} x The value to check.
 */
function isSet(x: unknown) {
  return x instanceof Set;
}

/**
 * Iterates over any collection invoking `cb` on every element in the `collection`.
 * @param  u The collection to map over.
 * @param  cb The callback function invoked per element in the collection. The callback is expected to be unary.
 */
function map<T extends object>(u: T | unknown, cb: unknown) {
  let p = or(or(and(isMap(u), new Map()), and(isSet(u), new Set())), false);
  if (p) {
    // @ts-ignore
    for (const [a, b] of entries(u)) {
      // @ts-ignore: p is a Map or Set object otherwise this code block doesn't execute
      p.set(a, cb(b));
    }
    return p;
  }
  // @ts-ignore
  p = isArray(u) ? new Array(u.length) : {};
  // @ts-ignore
  for (const [a, b] of entries(u)) {
    // @ts-ignore
    p[a] = cb(b);
  }

  return p as T;
}

function min(arr: Array<number>) {
  return extremum("min", arr);
}

function extremum(e: "min" | "max", arr: Array<number> = []) {
  return arr.reduce(
    (a, b) => Math[e](a, b),
    eq(e, "max") ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  );
}

function max(arr: Array<number>) {
  return extremum("max", arr);
}

function reNum(s: unknown) {
  const re = /[0-9]*\.?[0-9]+/;

  // @ts-ignore
  return and(re.test(s), Number(re.exec(s)["0"]));
}

function reOp(s: unknown = ""): string {
  // used character classes, more concise
  const re = /^[\*+\-/<>]|={1,2}|!={0,2}/;

  return and(re.test(s as string), String(re.exec(s as string)?.[0]));
}
function sortedColl(fact: Factor, cb: (x: unknown) => unknown, o = "asc") {
  return (c: Collection) => {
    const data = values(colorObjColl(fact, cb)(c)).sort(customSort(o, fact));

    if (isArray(c)) return data;

    const out = new Map();

    for (const z in data) {
      out.set(z, data[z]);
    }

    return out;
  };
}

function filteredColl(fact: Factor, cb: (x: unknown) => unknown) {
  return (c: unknown, s: string | number, e: string | number | undefined) => {
    let data = values(colorObjColl(fact, cb)(c));

    if (eq(typeof s, "number") && eq(typeof e, "number"))
      return data.filter((j) => inRange(j[fact], s as number, e as number));

    const start: number = Number.parseFloat(reNum(s).toString());
    const end: number = Number.parseFloat(reNum(e).toString());

    // @ts-ignore:
    const comparator = (x) => (y) => {
      const op = typeof x === "string" && reOp(x);
      const num = reNum(x);
      const hasNum = typeof num === "number" && !Number.isNaN(num);
      // @ts-ignore:
      const hasOp = keys(operators).includes(op);

      if (hasNum)
        // @ts-ignore:
        return hasOp
          ? // @ts-ignore:
            operators[op](y[fact], num)
          : inRange(y[fact], num);
      // @ts-ignore:
      return Error("argument must contain a number for comparison");
    };
    if (start && end)
      data = data.filter((l) => comparator(start)(l) && comparator(end)(l));
    else data = data.filter((l) => comparator(start)(l));

    return data;
  };
}

/**
 * Parses the colorspace of the passed in color token. Meant for arrays and color objects.
 * @param c The color token
 */
function getSrcMode(c: ColorToken): Colorspaces {
  // @ts-ignore
  return isArray(c) && typeof c[0] !== "number"
    ? c[0]
    : typeof c === "object" && "mode" in c
      ? (c?.mode as Colorspaces)
      : "rgb";
}

const ctrst = (a: unknown) => (b: unknown) =>
  contrast(b as ColorToken, a as ColorToken);

export {
  add,
  adjustHue,
  and,
  chnDiff,
  ci,
  colorObj,
  colorObjColl,
  ctrst,
  customFindKey,
  customSort,
  dstnce,
  ef,
  entries,
  eq,
  exprParser,
  filteredColl,
  floorCeil,
  getSrcMode,
  give,
  gmchn,
  gt,
  gte,
  hf,
  hi,
  inRange,
  isArray,
  isInt,
  iterator,
  keys,
  li,
  lt,
  lte,
  map,
  max,
  mcchn,
  min,
  neq,
  not,
  or,
  rand,
  reNum,
  reOp,
  sortedColl,
  take,
  values,
  initCspace,
};
