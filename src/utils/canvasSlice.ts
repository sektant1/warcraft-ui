type Img = CanvasImageSource & { width: number; height: number };

/** Source sub-rectangle of a texture, in texture pixels. */
export interface SrcRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Draw a texture horizontally three-sliced: the left/right caps keep their
 * aspect ratio (scaled by destination height), only the middle stretches.
 * Prevents end caps from being smeared when a bar is much wider than its
 * source texture.
 */
export function drawThreeSlice(
  ctx: CanvasRenderingContext2D,
  img: Img,
  capSrcW: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const sw = img.width;
  const sh = img.height;
  const scale = h / sh;
  // Never let the caps overlap on very narrow bars
  const cap = Math.min(capSrcW * scale, w / 2);
  const capSrc = cap / scale;
  ctx.drawImage(img, 0, 0, capSrc, sh, x, y, cap, h);
  const midW = w - cap * 2;
  if (midW > 0) {
    ctx.drawImage(img, capSrc, 0, sw - capSrc * 2, sh, x + cap, y, midW, h);
  }
  ctx.drawImage(img, sw - capSrc, 0, capSrc, sh, x + w - cap, y, cap, h);
}
