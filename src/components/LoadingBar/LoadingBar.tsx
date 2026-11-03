import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { drawThreeSlice } from "../../utils/canvasSlice";
import "./style.css";

interface Props {
  progress: number;
}

/*
 * Loading-BarBorder.blp / Loading-BarGlass.blp are 512×64. The ornate end
 * caps occupy x 0–36 and 476–512; the open channel the fill shows through is
 * y 22–41. Everything (background, fill, glow) is drawn inside that channel
 * and the border is drawn last, so nothing pokes out past the caps.
 *
 * Loading-BarGlow.blp is a 512×128 comet on an opaque black background with
 * its bright head at ~92% of the width; it's drawn additively and clipped to
 * the channel so its black background never shows.
 */
const SRC_H = 64;
const CAP_PX = 36;
const CHANNEL_TOP = 21;
const CHANNEL_BOTTOM = 43;
const GLOW_HEAD = 0.92;

export default function LoadingBar({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tex = useBlpTextures({
    bg: "loading/Loading-BarBackground.blp",
    fill: "loading/Loading-BarFill.blp",
    border: "loading/Loading-BarBorder.blp",
    glass: "loading/Loading-BarGlass.blp",
    glow: "loading/Loading-BarGlow.blp",
  });

  const pct = Math.max(0, Math.min(Number.isFinite(progress) ? progress : 0, 100));

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      const s = h / SRC_H;
      const cap = Math.min(CAP_PX * s, w / 4);
      const cx = cap;
      const cw = w - cap * 2;
      const cy = CHANNEL_TOP * s;
      const ch = (CHANNEL_BOTTOM - CHANNEL_TOP) * s;
      const fillW = (cw * pct) / 100;

      ctx.save();
      ctx.beginPath();
      ctx.rect(cx, cy, cw, ch);
      ctx.clip();

      // Tiled background inside the channel
      const bgPat = ctx.createPattern(tex.bg, "repeat");
      if (bgPat) {
        ctx.fillStyle = bgPat;
        ctx.fillRect(cx, cy, cw, ch);
      }

      if (fillW > 0) {
        ctx.drawImage(tex.fill, 0, 0, tex.fill.width, tex.fill.height, cx, cy, fillW, ch);

        // Comet glow trailing behind the leading edge
        if (pct < 100) {
          const glowH = ch * 2.4;
          const glowW = Math.min(glowH * 4, cw * 0.6);
          const gx = cx + fillW - glowW * GLOW_HEAD;
          const gy = cy + ch / 2 - glowH / 2;
          ctx.globalCompositeOperation = "lighter";
          ctx.drawImage(tex.glow, gx, gy, glowW, glowH);
        }
      }
      ctx.restore();

      drawThreeSlice(ctx, tex.border, CAP_PX, 0, 0, w, h);
      drawThreeSlice(ctx, tex.glass, CAP_PX, 0, 0, w, h);
    },
    [tex, pct],
  );

  useCanvasRenderer(canvasRef, draw, [tex, pct]);

  return (
    <div
      className="loading-bar-composite"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.floor(pct)}
    >
      <canvas ref={canvasRef} className="lb-canvas" />
      <div className="lb-text">{Math.floor(pct)}%</div>
    </div>
  );
}
