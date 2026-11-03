import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Tooltip from "./Tooltip";

interface Props {
  /** Element the tooltip points at. Nothing renders while null. */
  anchor: HTMLElement | null;
  icon?: ReactNode;
  children: ReactNode;
  /** Horizontal alignment relative to the anchor (default "center"). */
  align?: "center" | "start" | "end";
  /** Gap between anchor and tooltip in px (default 6). */
  offset?: number;
  maxWidth?: number;
}

const VIEWPORT_MARGIN = 8;

/**
 * A Tooltip rendered into document.body with fixed positioning, so it is
 * never clipped by an `overflow: hidden` / scrolling ancestor. Prefers to sit
 * above the anchor, flips below when there's no room, and is clamped to the
 * viewport horizontally.
 */
export default function AnchoredTooltip({
  anchor,
  icon,
  children,
  align = "center",
  offset = 6,
  maxWidth = 280,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchor) return;
    const place = () => {
      const el = ref.current;
      if (!el) return;
      const a = anchor.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      let left =
        align === "start"
          ? a.left
          : align === "end"
            ? a.right - t.width
            : a.left + a.width / 2 - t.width / 2;
      left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(left, vw - t.width - VIEWPORT_MARGIN),
      );

      let top = a.top - t.height - offset;
      if (top < VIEWPORT_MARGIN && a.bottom + offset + t.height <= vh) {
        top = a.bottom + offset;
      }
      setPos({ top, left });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchor, align, offset]);

  if (!anchor || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      style={{
        position: "fixed",
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        // Measure first, then show — avoids a one-frame flash at (0,0)
        visibility: pos ? "visible" : "hidden",
        zIndex: 1000,
        width: "max-content",
        maxWidth,
        pointerEvents: "none",
      }}
    >
      <Tooltip icon={icon}>{children}</Tooltip>
    </div>,
    document.body,
  );
}
