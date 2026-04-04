import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import "./style.css";

export type CommandSlotState =
  | "ready"
  | "passive"
  | "levelup"
  | "active"
  | "empty";

export interface CommandSlot {
  hotkey?: string;
  label?: string;
  /** BLP path relative to public/, e.g. "buttons/command/BTNAttack.blp" */
  iconPath?: string;
  state: CommandSlotState;
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
}: {
  slot: CommandSlot;
  size: number;
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

/** Default Blademaster command card slots for showcase */
export const BLADEMASTER_SLOTS: CommandSlot[] = [
  { hotkey: "Q", label: "Move", iconPath: "buttons/command/BTNMove.blp", state: "ready" },
  { hotkey: "W", label: "Stop", iconPath: "buttons/command/BTNStop.blp", state: "ready" },
  { hotkey: "E", label: "Hold Position", iconPath: "buttons/command/BTNHoldPosition.blp", state: "ready" },
  { hotkey: "R", label: "Attack", iconPath: "buttons/command/BTNAttack.blp", state: "ready" },
  { hotkey: "A", label: "Patrol", iconPath: "buttons/command/BTNPatrol.blp", state: "ready" },
  { label: "Empty", state: "empty" },
  { label: "Empty", state: "empty" },
  { hotkey: "F", label: "Learn Skill", iconPath: "buttons/command/BTNSkillz.blp", state: "levelup" },
  { hotkey: "Z", label: "Wind Walk", iconPath: "buttons/command/BTNWindWalkOn.blp", state: "active" },
  { hotkey: "X", label: "Mirror Image", iconPath: "buttons/command/BTNMirrorImage.blp", state: "ready" },
  { hotkey: "C", label: "Critical Strike", iconPath: "buttons/command/BTNCriticalStrike.blp", state: "passive" },
  { hotkey: "V", label: "Bladestorm", iconPath: "buttons/command/BTNWhirlwind.blp", state: "ready" },
];

export default function CommandCard({ slots, cellSize = 64 }: Props) {
  const displaySlots = slots.slice(0, 12);
  // Pad to 12 if fewer
  while (displaySlots.length < 12) {
    displaySlots.push({ state: "empty" });
  }

  return (
    <div className="command-card-preview">
      <div
        className="command-card-grid"
        role="grid"
        aria-label="Command card"
        style={{
          gridTemplateColumns: `repeat(4, ${cellSize}px)`,
          gridTemplateRows: `repeat(3, ${cellSize}px)`,
        }}
      >
        {displaySlots.map((slot, i) => (
          <div key={i} className="command-card-cell">
            <CommandButton slot={slot} size={cellSize} />
          </div>
        ))}
      </div>
    </div>
  );
}
