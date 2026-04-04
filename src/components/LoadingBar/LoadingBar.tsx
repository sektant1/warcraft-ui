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

      // Inset proportional to border texture thickness
      const pad = Math.round(h * 0.12);
      ctx.save();
      ctx.beginPath();
      ctx.rect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.clip();
      const bgPattern = ctx.createPattern(tex.bg, "repeat");
      if (bgPattern) {
        ctx.fillStyle = bgPattern;
        ctx.fillRect(pad, pad, w - pad * 2, h - pad * 2);
      }
      ctx.restore();

      // Tiled fill (4px inset matches original renderer)
      const fillPx = ((w - pad * 2) * pct) / 100;
      if (fillPx > 0) {
        const pattern = ctx.createPattern(tex.fill, "repeat");
        if (pattern) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(pad, pad, fillPx, h - pad * 2);
          ctx.clip();
          ctx.fillStyle = pattern;
          ctx.fillRect(pad, pad, fillPx, h - pad * 2);
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
