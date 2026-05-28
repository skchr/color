import vangogh from "./vangogh.ts";
import impressionist from "./impressionist.ts";
import picasso from "./picasso.ts";
import type {
  Collection,
  ColorToken,
  VangoghOptions,
  ImpressionistOptions,
  PicassoOptions,
  ArtistType,
} from "../types.d.ts";

type ArtistOptions = VangoghOptions | ImpressionistOptions | PicassoOptions;

function artist(
  type: "vangogh",
): (baseColor?: ColorToken, options?: VangoghOptions) => Collection;
function artist(
  type: "impressionist",
): (baseColor?: ColorToken, options?: ImpressionistOptions) => Collection;
function artist(
  type: "picasso",
): (baseColor?: ColorToken, options?: PicassoOptions) => Collection;
/**
 * Creates an artist-inspired palette generator function.
 *
 * @param {ArtistType} type The artist or art movement to base the palette on.
 * @returns {(baseColor?: ColorToken, options?: ArtistOptions) => Collection} A function that generates palettes for the specified artist.
 *
 * @example
 * ```ts
 * import { artist } from '@skchr/color'
 *
 * const vangoghPalette = artist("vangogh")
 * vangoghPalette("yellow", { period: "arles" })
 * ```
 */
function artist(
  type: ArtistType,
): (baseColor?: ColorToken, options?: ArtistOptions) => Collection {
  switch (type) {
    case "vangogh":
      return (baseColor?, options?) =>
        vangogh(baseColor, options as VangoghOptions);
    case "impressionist":
      return (baseColor?, options?) =>
        impressionist(baseColor, options as ImpressionistOptions);
    case "picasso":
      return (baseColor?, options?) =>
        picasso(baseColor, options as PicassoOptions);
  }
}

export { artist };
