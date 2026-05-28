import { rand } from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type { Collection, ColorToken, PicassoOptions } from "../types.d.ts";

const normalizeHue = (h: number) => ((h % 360) + 360) % 360;

const BLUE_PERIOD = {
  hues: [215, 225, 235, 245, 255, 265],
  lightness: { min: 4, max: 32 },
  chroma: { min: 8, max: 48 },
};
const ROSE_PERIOD = {
  hues: [350, 355, 5, 15, 25],
  lightness: { min: 38, max: 82 },
  chroma: { min: 18, max: 72 },
};

function generateBluePeriodPalette(
  intensity: number,
  num: number,
  baseHue?: number,
): Array<{ h: number; c: number; l: number }> {
  const palette: Array<{ h: number; c: number; l: number }> = [];
  const darknessFactor = intensity;
  const hues = baseHue
    ? BLUE_PERIOD.hues.map((h) => normalizeHue(h + (baseHue - 230) * 0.25))
    : BLUE_PERIOD.hues;

  for (let i = 0; i < num; i++) {
    const t = i / (num - 1 || 1);
    const hueIndex = Math.floor(rand(0, hues.length));
    const lightness =
      (BLUE_PERIOD.lightness.min +
        (BLUE_PERIOD.lightness.max - BLUE_PERIOD.lightness.min) * t) *
      (1 - darknessFactor * 0.55);
    const chroma =
      (BLUE_PERIOD.chroma.min +
        (BLUE_PERIOD.chroma.max - BLUE_PERIOD.chroma.min) *
          (1 - darknessFactor * 0.65)) *
      (0.4 + t * 0.6);
    palette.push({
      h: normalizeHue(hues[hueIndex] + rand(-8, 8)),
      c: Math.max(3, chroma),
      l: Math.max(2, Math.min(45, lightness)),
    });
  }
  return palette;
}

function generateRosePeriodPalette(
  num: number,
  baseHue?: number,
): Array<{ h: number; c: number; l: number }> {
  const palette: Array<{ h: number; c: number; l: number }> = [];
  const roseHues = baseHue
    ? ROSE_PERIOD.hues.map((h) => normalizeHue(h + (baseHue - 10) * 0.3))
    : ROSE_PERIOD.hues;

  for (let i = 0; i < num; i++) {
    const t = i / (num - 1 || 1);
    const hueIndex = Math.floor(rand(0, roseHues.length));
    const isFleshTone = rand(0, 1) < 0.3;
    if (isFleshTone && num > 3) {
      palette.push({
        h: normalizeHue(20 + rand(-8, 8)),
        c: 25 + rand(-5, 10),
        l: 72 + rand(-8, 12),
      });
    } else {
      const lightness =
        ROSE_PERIOD.lightness.min +
        (ROSE_PERIOD.lightness.max - ROSE_PERIOD.lightness.min) * t;
      const chroma =
        (ROSE_PERIOD.chroma.min +
          (ROSE_PERIOD.chroma.max - ROSE_PERIOD.chroma.min) * (1 - t * 0.25)) *
        (0.5 + t * 0.5);
      palette.push({
        h: normalizeHue(roseHues[hueIndex] + rand(-8, 8)),
        c: Math.max(5, chroma),
        l: Math.max(35, Math.min(90, lightness)),
      });
    }
  }
  return palette;
}

/**
 * Generates a palette inspired by Pablo Picasso's Blue and Rose periods.
 *
 * @param {ColorToken} [baseColor="blue"] The base color to derive the palette from.
 * @param {PicassoOptions} [options] Optional overrides for period, intensity, and number of colors.
 * @returns {Collection} An array of color tokens forming a Picasso-inspired palette.
 *
 * @example
 * ```ts
 * import { picasso } from '@skchr/color'
 *
 * picasso("blue", { period: "blue", intensity: 0.8 })
 * ```
 */
export default function picasso(
  baseColor: ColorToken = "blue",
  options: PicassoOptions = {},
): Collection {
  const { period = "blue", intensity = 0.5, num = 6 } = options;
  const baseObj = token(baseColor, { kind: "obj", targetMode: "lch" }) as {
    h: number;
  };
  const inputHue = baseObj.h;
  const colorData =
    period === "blue"
      ? generateBluePeriodPalette(intensity, num, inputHue)
      : generateRosePeriodPalette(num, inputHue);
  const palette: ColorToken[] = colorData.map((color) =>
    token(
      { mode: "lch", h: color.h, l: color.l, c: color.c },
      options?.tokenOptions,
    ),
  );
  return [...new Set(palette)];
}
