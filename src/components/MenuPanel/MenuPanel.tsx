import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { rotateCellClockwise } from "../../utils/glueButton";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import "./style.css";

interface Props {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function MenuPanel({ style, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const race = useCurrentRace();
  const rp = RACE_PREFIXES[race];

  const bgPath = `buttons/esc/${rp.esc}/${rp.esc}-options-menu-background.blp`;
  const borderPath = `buttons/esc/${rp.esc}/${rp.esc}-options-menu-border.blp`;
  const tex = useBlpTextures({ bg: bgPath, border: borderPath });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      // Tiled background
      const pattern = ctx.createPattern(tex.bg, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }

      // Nine-slice border from 8-cell horizontal atlas
      const atlasW = tex.border.width;
      const atlasH = tex.border.height;
      const cellW = atlasW / 8;
      const corner = Math.max(
        1,
        Math.floor(Math.min(cellW, h * 0.35, w / 2, h / 2)),
      );

      const drawCell = (
        idx: number,
        x: number,
        y: number,
        cw: number,
        ch: number,
      ) => {
        if (cw <= 0 || ch <= 0) return;
        ctx.drawImage(tex.border, idx * cellW, 0, cellW, atlasH, x, y, cw, ch);
      };

      // Corners
      drawCell(4, 0, 0, corner, corner);
      drawCell(5, w - corner, 0, corner, corner);
      drawCell(6, 0, h - corner, corner, corner);
      drawCell(7, w - corner, h - corner, corner, corner);

      // Vertical edges
      const edgeH = h - corner * 2;
      if (edgeH > 0) {
        drawCell(0, 0, corner, corner, edgeH);
        drawCell(1, w - corner, corner, corner, edgeH);
      }

      // Horizontal edges (rotated)
      const edgeW = w - corner * 2;
      if (edgeW > 0) {
        const topRot = rotateCellClockwise(tex.border, 2, cellW, atlasH);
        const botRot = rotateCellClockwise(tex.border, 3, cellW, atlasH);
        ctx.drawImage(topRot, corner, 0, edgeW, corner);
        ctx.drawImage(botRot, corner, h - corner, edgeW, corner);
      }
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
