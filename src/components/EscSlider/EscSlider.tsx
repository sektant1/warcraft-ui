import { useEffect, useRef, useState } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  /** Default: 0.5 */
  defaultValue?: number;
}

export default function EscSlider({ label, value: controlled, onChange, defaultValue = 0.5 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();
  const [internal, setInternal] = useState(controlled ?? defaultValue);
  const dragging = useRef(false);

  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    renderer.sliders.push({
      ref: () => ref.current!,
      value: () => valueRef.current,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateFromEvent = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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
      <div ref={ref} className="wc-slider" />
    </div>
  );
}
