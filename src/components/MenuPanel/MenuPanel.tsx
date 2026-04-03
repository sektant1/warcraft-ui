import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import "./style.css";

interface Props {
  variant?: "menu" | "cinematic";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function MenuPanel({
  style,
  children,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const race = useCurrentRace();
  const rp = RACE_PREFIXES[race];

  const bgPath = `buttons/esc/${rp.esc}/${rp.esc}-options-menu-background.blp`;
  const tex = useBlpTextures({ bg: bgPath });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      // Tiled background
      const pattern = ctx.createPattern(tex.bg, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }

      // Colored border lines
      const bw = 3;
      const r = 0.541 * 255,
        g = 0.478 * 255,
        b = 0.353 * 255;
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
    <div className="wc-menu-panel" style={style}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
      {children && (
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      )}
    </div>
  );
}
