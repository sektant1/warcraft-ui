import { useCallback, useRef } from "react";
import {
  useBlpTextures,
  useCanvasRenderer,
  type BlpSource,
} from "../../utils/blpLoader";
import { drawThreeSlice, type SrcRect } from "../../utils/canvasSlice";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import { healthColor } from "../../utils/healthColor";
import type { Race } from "../../utils/types";
import "./style.css";

interface Props {
  label?: string;
  type: "health" | "mana" | "xp" | "build";
  fillPercent: number;
  maxValue?: number;
  height?: number;
  /** @deprecated XP and build bars always draw their frame; kept for API compatibility. */
  hasBorder?: boolean;
  race?: Race;
}

/*
 * Texture layouts (measured from the BLPs):
 *
 * statbar-highlight 256×32 — dark blue track; usable area x15–241, y5–22
 *                            (outside that are black margins / a gold rule).
 * statbar-color     128×32 — greyscale fill gradient in rows 0–24; rows 24+
 *                            are a separate shadow strip that must not be drawn.
 * statbar-edge      256×32 — pill-shaped cut-out mask: opaque only in the four
 *                            corners. Used to round the bar ends (destination-out).
 * bigbar-fill       256×32 — 4px black padding around the fill.
 * xpbar-border      256×32 — 4px gold frame, transparent inside.
 * buildprogressbar-fill/border 128×16 — same layout with 4px padding/frame.
 */
const TRACK_SRC: SrcRect = { x: 15, y: 5, w: 226, h: 17 };
const UNIT_FILL_SRC: SrcRect = { x: 0, y: 0, w: 128, h: 24 };
const XP_FILL_SRC: SrcRect = { x: 4, y: 4, w: 248, h: 24 };
const BUILD_FILL_SRC: SrcRect = { x: 4, y: 4, w: 120, h: 8 };
/** Frame thickness of xp/build borders, in source pixels. */
const FRAME_PX = 4;
/** Half the pill height of statbar-edge, in source pixels (its corner radius). */
const EDGE_CAP_PX = 16;

const FILL_TINTS: Record<Props["type"], string | ((pct: number) => string)> = {
  health: healthColor,
  mana: "#2f4fd4",
  xp: "#7f49b5",
  build: "",
};

/** Race texture first, Human as fallback (most races ship no bar textures). */
function raceTex(race: string, name: string): BlpSource {
  return race === "human"
    ? `bars/human-${name}.blp`
    : [`bars/${race}-${name}.blp`, `bars/human-${name}.blp`];
}

function drawSrc(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  s: SrcRect,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (w <= 0 || h <= 0) return;
  ctx.drawImage(img, s.x, s.y, s.w, s.h, x, y, w, h);
}

export default function StatBar({
  label,
  type,
  fillPercent,
  maxValue,
  height = 18,
  race: raceProp,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalRace = useCurrentRace();
  const race = RACE_PREFIXES[raceProp ?? globalRace].lower;
  const isUnit = type === "health" || type === "mana";
  const pct = Math.max(0, Math.min(100, Number.isFinite(fillPercent) ? fillPercent : 0));

  const paths: Record<string, BlpSource> = {
    track: raceTex(race, "statbar-highlight"),
  };
  if (isUnit) {
    paths.fill = raceTex(race, "statbar-color");
    paths.edge = raceTex(race, "statbar-edge");
  } else if (type === "xp") {
    paths.fill = raceTex(race, "bigbar-fill");
    paths.border = raceTex(race, "xpbar-border");
  } else {
    paths.fill = raceTex(race, "buildprogressbar-fill");
    paths.border = raceTex(race, "buildprogressbar-border");
  }

  const tex = useBlpTextures(paths);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      const tintSpec = FILL_TINTS[type];
      const tint = typeof tintSpec === "function" ? tintSpec(pct) : tintSpec;

      // Inner track rectangle the fill lives in
      let ix = 0;
      let iy = 0;
      let iw = w;
      let ih = h;
      if (!isUnit) {
        const b = (FRAME_PX * h) / tex.border.height;
        ix = b;
        iy = b;
        iw = w - b * 2;
        ih = h - b * 2;
      }

      // 1. Track background
      drawSrc(ctx, tex.track, TRACK_SRC, ix, iy, iw, ih);

      // 2. Fill, clipped to the inner track
      const fillW = (iw * pct) / 100;
      if (fillW > 0.5) {
        const src = isUnit
          ? UNIT_FILL_SRC
          : type === "xp"
            ? XP_FILL_SRC
            : BUILD_FILL_SRC;
        drawSrc(ctx, tex.fill, src, ix, iy, fillW, ih);
        if (tint) {
          ctx.save();
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = tint;
          ctx.fillRect(ix, iy, fillW, ih);
          ctx.restore();
        }
        // Soft leading edge so the fill doesn't end in a hard cut
        if (fillW < iw - 1) {
          const edgeW = Math.min(3, fillW);
          const grad = ctx.createLinearGradient(ix + fillW - edgeW, 0, ix + fillW, 0);
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(1, "rgba(0,0,0,0.45)");
          ctx.fillStyle = grad;
          ctx.fillRect(ix + fillW - edgeW, iy, edgeW, ih);
        }
      }

      if (isUnit) {
        // 3a. Round the ends: statbar-edge is opaque only outside the pill,
        // so punch those corners out of everything drawn so far.
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        drawThreeSlice(ctx, tex.edge, EDGE_CAP_PX, 0, 0, w, h);
        ctx.restore();
        // Thin dark rim to separate the pill from the page
        const r = h / 2;
        ctx.save();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(r, 0.5);
        ctx.lineTo(w - r, 0.5);
        ctx.arc(w - r, r, r - 0.5, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(r, h - 0.5);
        ctx.arc(r, r, r - 0.5, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      } else {
        // 3b. Frame on top, three-sliced so the corners keep their shape
        drawThreeSlice(ctx, tex.border, FRAME_PX, 0, 0, w, h);
      }
    },
    [tex, pct, type, isUnit],
  );

  useCanvasRenderer(canvasRef, draw, [tex, pct, type]);

  const barText = () => {
    const rounded = Math.round(pct * 10) / 10;
    if (type !== "build" && maxValue) {
      return Math.round((maxValue * pct) / 100) + " / " + maxValue;
    }
    return rounded + "%";
  };

  return (
    <div className="wc-bar-row">
      {label && <span className="wc-bar-label">{label}</span>}
      <div
        className="wc-stat-bar"
        style={{ height: height + "px" }}
        role="progressbar"
        aria-label={label ?? type}
        aria-valuemin={0}
        aria-valuemax={maxValue ?? 100}
        aria-valuenow={maxValue ? Math.round((maxValue * pct) / 100) : Math.round(pct)}
      >
        <canvas ref={canvasRef} className="wc-stat-bar__canvas" />
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
