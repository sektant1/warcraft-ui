import { useCallback, useRef, useState } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import "./style.css";

const PRESSED_OFFSET_X = 2;
const PRESSED_OFFSET_Y = 2;

interface Props {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function EscOptionButton({
  onClick,
  disabled,
  children,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const race = useCurrentRace();
  const rp = RACE_PREFIXES[race];

  // Original renderer uses escBtnBg (tiled) + escBtnBorder + escBtnHighlight
  // For Human: bg = human-options-menu-background, for others: race-options-button-background
  const bgPath =
    race === "Human"
      ? "buttons/esc/human/human-options-menu-background.blp"
      : `buttons/esc/${rp.esc}/${rp.esc}-options-button-background.blp`;

  // Border is always the human border
  const borderPath = "buttons/esc/human/human-options-button-border-up.blp";
  const highlightPath = `buttons/esc/${rp.esc}/${rp.esc}-options-button-highlight.blp`;

  const tex = useBlpTextures({
    bg: bgPath,
    border: borderPath,
    highlight: highlightPath,
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

      // Border overlay (stretched to fit)
      ctx.drawImage(tex.border, 0, 0, w, h);

      // Hover highlight (additive blend)
      if (hovered && !pressed && !disabled) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(tex.highlight, 0, 0, w, h);
        ctx.restore();
      }
    },
    [tex, hovered, pressed, disabled],
  );

  useCanvasRenderer(canvasRef, draw, [tex, hovered, pressed, disabled]);

  const handlers = disabled
    ? {}
    : {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => {
          setHovered(false);
          setPressed(false);
        },
        onMouseDown: () => setPressed(true),
        onMouseUp: () => setPressed(false),
      };

  return (
    <button
      type="button"
      className="wc-esc-option-btn"
      disabled={disabled}
      onClick={onClick}
      {...handlers}
    >
      <canvas ref={canvasRef} className="wc-esc-option-canvas" />
      <span
        className={`wc-esc-option-label${disabled ? " wc-esc-option-label--disabled" : ""}`}
        style={{
          transform: pressed
            ? `translate(${PRESSED_OFFSET_X}px, ${PRESSED_OFFSET_Y}px)`
            : "none",
        }}
      >
        {children}
      </span>
    </button>
  );
}
