import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import "./style.css";

interface Props {
  label?: string;
  type: "health" | "mana" | "xp" | "build";
  fillPercent: number;
  maxValue?: number;
  height?: number;
  hasBorder?: boolean;
}

export default function StatBar({
  label,
  type,
  fillPercent,
  maxValue,
  height = 18,
  hasBorder = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const race = useCurrentRace();
  const rp = RACE_PREFIXES[race];

  const paths: Record<string, string> = {
    fill: `bars/${rp.lower}-${type === "health" ? "healthbar" : type === "mana" ? "manabar" : type === "xp" ? "bigbar" : "buildprogressbar"}-fill.blp`,
  };
  if (hasBorder && (type === "xp" || type === "build")) {
    paths.border =
      type === "xp"
        ? `bars/${rp.lower}-xpbar-border.blp`
        : `bars/${rp.lower}-buildprogressbar-border.blp`;
  }

  const tex = useBlpTextures(paths);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Black background
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, w, h);

      if (!tex) return;

      // Tiled fill
      const fillPx = (w * fillPercent) / 100;
      if (fillPx > 0) {
        const pattern = ctx.createPattern(tex.fill, "repeat");
        if (pattern) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, fillPx, h);
          ctx.clip();
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, fillPx, h);
          ctx.restore();
        }
      }

      // Border overlay
      if (hasBorder && tex.border) {
        ctx.drawImage(tex.border, 0, 0, w, h);
      }
    },
    [tex, fillPercent, hasBorder],
  );

  useCanvasRenderer(canvasRef, draw, [tex, fillPercent, hasBorder]);

  const barText = () => {
    if (type === "build") return fillPercent + "%";
    if (maxValue) {
      return (
        Math.floor((maxValue * fillPercent) / 100) + "\u00a0/ " + maxValue
      );
    }
    return fillPercent + "%";
  };

  return (
    <div className="wc-bar-row">
      {label && <span className="wc-bar-label">{label}</span>}
      <div className="wc-stat-bar" style={{ height: height + "px" }}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          className="wc-bar-text"
          style={height < 18 ? { fontSize: "0.6rem" } : undefined}
        >
          {barText()}
        </div>
      </div>
    </div>
  );
}
