import { adjustHue, rand } from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type {
  Collection,
  ColorToken,
  ImpressionistOptions,
} from "../types.d.ts";

const normalizeHue = (h: number) => ((h % 360) + 360) % 360;

const TIME_CONFIGS = {
  morning: {
    lightness: { min: 50, max: 84 },
    hueShift: 15,
    warmth: 0.28,
    saturation: 0.72,
  },
  noon: {
    lightness: { min: 58, max: 96 },
    hueShift: 0,
    warmth: 0.0,
    saturation: 1.0,
  },
  evening: {
    lightness: { min: 26, max: 70 },
    hueShift: -15,
    warmth: 0.5,
    saturation: 0.83,
  },
  dusk: {
    lightness: { min: 10, max: 46 },
    hueShift: -26,
    warmth: -0.24,
    saturation: 0.56,
  },
};

/**
 * Generates a palette inspired by Impressionist and Neo-Impressionist color techniques.
 *
 * @param {ColorToken} [baseColor="green"] The base color to derive the palette from.
 * @param {ImpressionistOptions} [options] Optional overrides for technique, time of day, blue shadows, and number of colors.
 * @returns {Collection} An array of color tokens forming an Impressionist-inspired palette.
 *
 * @example
 * ```ts
 * import { impressionist } from '@skchr/color'
 *
 * impressionist("green", { timeOfDay: "morning" })
 * ```
 */
export default function impressionist(
  baseColor: ColorToken = "green",
  options: ImpressionistOptions = {},
): Collection {
  const {
    technique = "broken",
    timeOfDay = "noon",
    blueShadows = true,
    num = 6,
  } = options;

  const baseObj = token(baseColor, { kind: "obj", targetMode: "lch" }) as {
    h: number;
    c: number;
    l: number;
  };
  const timeConfig = TIME_CONFIGS[timeOfDay];

  const baseHue = baseObj.h || 120;
  const complementHue = normalizeHue(baseHue + 180);

  const palette: ColorToken[] = [];
  const numColors = Math.max(3, num);

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1 || 1);
    let finalHue: number;

    if (technique === "optical") {
      const step = normalizeHue(complementHue - baseHue);
      finalHue = normalizeHue(baseHue + step * t + rand(-12, 12));
    } else {
      if (blueShadows && t < 0.2) {
        finalHue = normalizeHue(248 + rand(-10, 10));
      } else if (t < 0.5) {
        const lt = (t - (blueShadows ? 0.2 : 0)) / 0.3;
        finalHue = normalizeHue(
          248 + (baseHue - 248) * lt + rand(-15, 15) * (1 - lt),
        );
      } else {
        const lt = (t - 0.5) / 0.5;
        finalHue = normalizeHue(
          baseHue + (complementHue - baseHue) * lt + rand(-18, 18) * (1 - lt),
        );
      }
    }

    finalHue = normalizeHue(finalHue + timeConfig.hueShift * t * 0.4);

    let finalLightness =
      timeConfig.lightness.min +
      (timeConfig.lightness.max - timeConfig.lightness.min) * t;
    if (blueShadows && t < 0.2) finalLightness = 15 + t * 70;

    if (timeConfig.warmth !== 0) {
      const isWarm = finalHue < 55 || finalHue > 305;
      finalLightness = Math.max(
        8,
        Math.min(
          98,
          finalLightness +
            (isWarm ? timeConfig.warmth : -timeConfig.warmth * 0.32) * 14,
        ),
      );
    }

    const finalChroma =
      baseObj.c *
      timeConfig.saturation *
      (0.45 + 0.55 * Math.cos((t * Math.PI) / 2));

    palette.push(
      token(
        {
          mode: "lch",
          h: finalHue,
          l: Math.max(0, Math.min(100, finalLightness)),
          c: Math.max(0, Math.min(100, finalChroma)),
        },
        options?.tokenOptions,
      ),
    );
  }

  return [...new Set(palette)];
}
