import { useCallback, useRef, useState } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import Tooltip from "../Tooltip/Tooltip";
import BlpIcon from "../BlpIcon/BlpIcon";
import "./style.css";

export type CommandSlotState =
  | "ready"
  | "passive"
  | "levelup"
  | "active"
  | "empty";

export interface CommandSlotTooltip {
  name: string;
  type?: string;
  description: string;
  manaCost?: number;
  cooldown?: number;
}

export interface CommandSlot {
  hotkey?: string;
  label?: string;
  /** BLP path relative to public/, e.g. "buttons/command/BTNAttack.blp" */
  iconPath?: string;
  state: CommandSlotState;
  tooltip?: CommandSlotTooltip;
}

interface Props {
  /** 12 slots (4 cols × 3 rows), row-major order */
  slots: CommandSlot[];
  /** Cell size in px (default 64) */
  cellSize?: number;
}

function CommandButton({
  slot,
  size,
  onActiveChange,
}: {
  slot: CommandSlot;
  size: number;
  onActiveChange: (active: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paths: Record<string, string> = {
    border: "buttons/command/human-multipleselection-border.blp",
  };
  if (slot.iconPath && slot.state !== "empty") {
    paths.icon = slot.iconPath;
  }
  if (slot.state === "active") {
    paths.highlight =
      "buttons/command/human-multipleselection-heroglow.blp";
  }

  const tex = useBlpTextures(paths);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;

      if (slot.state === "empty") {
        // Dark empty slot background
        ctx.fillStyle = "#020308";
        ctx.fillRect(0, 0, w, h);
        // Border frame on top
        ctx.drawImage(tex.border, 0, 0, w, h);
        return;
      }

      // Icon
      if (tex.icon) {
        ctx.save();
        if (slot.state === "passive") {
          ctx.filter = "saturate(0.72) brightness(0.88)";
        }
        ctx.drawImage(tex.icon, 0, 0, w, h);
        ctx.restore();
      }

      // Border frame
      ctx.drawImage(tex.border, 0, 0, w, h);

      // Active highlight (additive glow)
      if (slot.state === "active" && tex.highlight) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(tex.highlight, 0, 0, w, h);
        ctx.restore();
      }
    },
    [tex, slot.state],
  );

  useCanvasRenderer(canvasRef, draw, [tex, slot.state]);

  if (slot.state === "empty") {
    return (
      <div
        className="cmd-btn cmd-btn-empty"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="cmd-btn-canvas" />
      </div>
    );
  }

  const stateClass =
    slot.state === "passive"
      ? " cmd-btn--passive"
      : slot.state === "levelup"
        ? " cmd-btn--levelup"
        : "";

  return (
    <button
      type="button"
      className={`cmd-btn${stateClass}`}
      style={{ width: size, height: size }}
      aria-label={`${slot.label || ""}${slot.hotkey ? ` (${slot.hotkey})` : ""}`}
      onMouseEnter={() => onActiveChange(true)}
      onMouseLeave={() => onActiveChange(false)}
      onFocus={() => onActiveChange(true)}
      onBlur={() => onActiveChange(false)}
    >
      <canvas ref={canvasRef} className="cmd-btn-canvas" />
      {slot.hotkey && (
        <span className="cmd-btn-hotkey" aria-hidden="true">
          {slot.hotkey}
        </span>
      )}
    </button>
  );
}

function CommandTooltip({ slot }: { slot: CommandSlot }) {
  const tt = slot.tooltip!;
  return (
    <Tooltip icon={slot.iconPath ? <BlpIcon path={slot.iconPath} size={38} /> : undefined}>
      <div>
        <strong style={{ color: "#fcd312" }}>{tt.name}</strong>
        {slot.hotkey && (
          <span style={{ color: "#808080", marginLeft: 6, fontSize: 11 }}>({slot.hotkey})</span>
        )}
      </div>
      {tt.type && <div style={{ color: "#00c000", fontSize: 11 }}>{tt.type}</div>}
      <div style={{ marginTop: 4, color: "#ccc", fontSize: 12 }}>{tt.description}</div>
      {(tt.manaCost != null || tt.cooldown != null) && (
        <div style={{ marginTop: 4, fontSize: 11, color: "#809fff" }}>
          {tt.manaCost != null && <span>Mana: {tt.manaCost}</span>}
          {tt.manaCost != null && tt.cooldown != null && <span>&nbsp;&nbsp;</span>}
          {tt.cooldown != null && <span>Cooldown: {tt.cooldown}s</span>}
        </div>
      )}
    </Tooltip>
  );
}

export default function CommandCard({ slots, cellSize = 64 }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const displaySlots = slots.slice(0, 12);
  // Pad to 12 if fewer
  while (displaySlots.length < 12) {
    displaySlots.push({ state: "empty" });
  }

  const activeSlot = activeIndex != null ? displaySlots[activeIndex] : undefined;

  return (
    <div className="command-card-preview">
      <div
        className="command-card-grid"
        role="group"
        aria-label="Command card"
        style={{
          gridTemplateColumns: `repeat(4, ${cellSize}px)`,
          gridTemplateRows: `repeat(3, ${cellSize}px)`,
        }}
      >
        {displaySlots.map((slot, i) => (
          <div key={i} className="command-card-cell">
            <CommandButton
              slot={slot}
              size={cellSize}
              onActiveChange={(active) =>
                setActiveIndex((cur) => (active ? i : cur === i ? null : cur))
              }
            />
          </div>
        ))}
        {/* Anchored to the whole grid (as in-game) so it never covers buttons */}
        {activeSlot?.tooltip && activeSlot.state !== "empty" && (
          <div className="cmd-card-tooltip" role="tooltip">
            <CommandTooltip slot={activeSlot} />
          </div>
        )}
      </div>
    </div>
  );
}
