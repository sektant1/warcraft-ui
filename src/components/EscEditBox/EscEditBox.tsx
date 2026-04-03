import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import "./style.css";

interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function EscEditBox({ value, placeholder, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tex = useBlpTextures({
    bg: "borders/esc/editbox-background.blp",
    border: "borders/esc/editbox-border.blp",
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;
      ctx.drawImage(tex.bg, 0, 0, w, h);
      ctx.drawImage(tex.border, 0, 0, w, h);
    },
    [tex],
  );

  useCanvasRenderer(canvasRef, draw, [tex]);

  return (
    <label className="wc3-editbox wc3-editbox--esc">
      <canvas
        ref={canvasRef}
        className="wc3-editbox-canvas"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
        style={{ position: "relative", zIndex: 1 }}
      />
    </label>
  );
}
