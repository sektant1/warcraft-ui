import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import "./style.css";

interface Props {
  children: React.ReactNode;
}

export default function Tooltip({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tex = useBlpTextures({
    bg: "tooltips/human-tooltip-background.blp",
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      // Tiled background
      const pattern = ctx.createPattern(tex.bg, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }

      // Gold colored border lines
      const bw = 2;
      const r = 0.784 * 255,
        g = 0.659 * 255,
        b = 0.306 * 255;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, w, bw); // top
      ctx.fillRect(0, h - bw, w, bw); // bottom
      ctx.fillRect(0, 0, bw, h); // left
      ctx.fillRect(w - bw, 0, bw, h); // right
    },
    [tex],
  );

  useCanvasRenderer(canvasRef, draw, [tex]);

  return (
    <div className="wc-tooltip">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div className="wc-tt-content">{children}</div>
    </div>
  );
}
