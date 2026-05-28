import { rand } from "../internal/index.ts";
import { token } from "../utils/index.ts";
import type { Collection, ColorToken, VangoghOptions } from "../types.d.ts";

const normalizeHue = (h: number) => ((h % 360) + 360) % 360;

const PERIOD_CONFIGS = {
  netherlands: {
    lightness: { min: 8, max: 40 },
    chroma: { min: 8, max: 40 },
    saturation: 0.45,
  },
  paris: {
    lightness: { min: 25, max: 70 },
    chroma: { min: 25, max: 70 },
    saturation: 0.7,
  },
  arles: {
    lightness: { min: 15, max: 90 },
    chroma: { min: 35, max: 90 },
    saturation: 0.95,
  },
};

/**
 * Generates a palette inspired by Vincent van Gogh's artistic periods.
 *
 * @param {ColorToken} [baseColor="yellow"] The base color to derive the palette from.
 * @param {VangoghOptions} [options] Optional overrides for period, contrast, and number of colors.
 * @returns {Collection} An array of color tokens forming a van Gogh-inspired palette.
 *
 * @example
 * ```ts
 * import { vangogh } from '@skchr/color'
 *
 * vangogh("yellow", { period: "arles" })
 * ```
 */
export default function vangogh(
  baseColor: ColorToken = "yellow",
  options: VangoghOptions = {},
): Collection {
  const { period = "arles", contrast = "bold", num = 6 } = options;

  const baseObj = token(baseColor, { kind: "obj", targetMode: "lch" }) as {
    h: number;
    c: number;
    l: number;
  };
  const periodConfig = PERIOD_CONFIGS[period];
  const contrastSpread =
    contrast === "subtle" ? 30 : contrast === "medium" ? 60 : 90;

  const baseHue = baseObj.h || 60;
  const complementHue = normalizeHue(baseHue + 180);

  const palette: ColorToken[] = [];
  const numColors = Math.max(3, num);

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1 || 1);
    const hueTowardComplement = normalizeHue(
      baseHue + ((complementHue - baseHue + 360) % 360) * t,
    );
    const hueVariation = rand(-contrastSpread / 3, contrastSpread / 3);
    const finalHue = normalizeHue(hueTowardComplement + hueVariation);

    const finalLightness =
      periodConfig.lightness.min +
      (periodConfig.lightness.max - periodConfig.lightness.min) * t;
    const chromaScale = baseObj.c * periodConfig.saturation;
    const finalChroma =
      periodConfig.chroma.min +
      (periodConfig.chroma.max - periodConfig.chroma.min) *
        (1 - t * 0.5) *
        (chromaScale / 100);

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
