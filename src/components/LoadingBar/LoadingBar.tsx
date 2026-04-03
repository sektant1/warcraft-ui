import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import "./style.css";

interface Props {
  progress: number;
}

export default function LoadingBar({ progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tex = useBlpTextures({
    bg: "loading/Loading-BarBackground.blp",
    fill: "loading/Loading-BarFill.blp",
    border: "loading/Loading-BarBorder.blp",
    glass: "loading/Loading-BarGlass.blp",
  });

  const pct = Math.min(progress, 98);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      // Background
      ctx.drawImage(tex.bg, 0, 0, w, h);

      // Tiled fill
      const fillPx = ((w - 8) * pct) / 100;
      if (fillPx > 0) {
        const pattern = ctx.createPattern(tex.fill, "repeat");
        if (pattern) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(4, 4, fillPx, h - 8);
          ctx.clip();
          ctx.fillStyle = pattern;
          ctx.fillRect(4, 4, fillPx, h - 8);
          ctx.restore();
        }
      }

      // Border
      ctx.drawImage(tex.border, 0, 0, w, h);

      // Glass overlay (additive blend)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.6;
      ctx.drawImage(tex.glass, 0, 0, w, h);
      ctx.restore();
    },
    [tex, pct],
  );

  useCanvasRenderer(canvasRef, draw, [tex, pct]);

  return (
    <div className="wc-loading-bar">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="wc-lb-text">{Math.floor(progress)}%</div>
    </div>
  );
}
