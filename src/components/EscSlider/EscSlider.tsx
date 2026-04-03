import { useCallback, useEffect, useRef, useState } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { useCurrentRace, RACE_PREFIXES } from "../../state/race";
import "./style.css";

interface Props {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  defaultValue?: number;
}

export default function EscSlider({
  label,
  value: controlled,
  onChange,
  defaultValue = 0.5,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(controlled ?? defaultValue);
  const dragging = useRef(false);
  const race = useCurrentRace();
  const rp = RACE_PREFIXES[race];

  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;

  const knobPath =
    race === "Human"
      ? "buttons/slider/slider-knob.blp"
      : `buttons/slider/${rp.esc}-slider-knob.blp`;

  const tex = useBlpTextures({
    bg: "buttons/slider/slider-background.blp",
    border: "buttons/slider/slider-border.blp",
    knob: knobPath,
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;
      ctx.drawImage(tex.bg, 0, 0, w, h);
      ctx.drawImage(tex.border, 0, 0, w, h);
      const knobW = 20,
        knobH = 28;
      const knobX = value * w - knobW / 2;
      const knobY = h / 2 - knobH / 2;
      ctx.drawImage(tex.knob, knobX, knobY, knobW, knobH);
    },
    [tex, value],
  );

  useCanvasRenderer(canvasRef, draw, [tex, value]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const updateFromEvent = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const next = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromEvent(x);
    };

    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      dragging.current = true;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromEvent(x);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: false });
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [isControlled, onChange]);

  return (
    <div className="wc-slider-row">
      {label && <span className="wc-slider-label">{label}</span>}
      <div ref={wrapRef} className="wc-slider">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </div>
  );
}
