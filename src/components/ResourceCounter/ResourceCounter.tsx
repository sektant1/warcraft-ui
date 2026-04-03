import { useCallback, useRef } from "react";
import { useBlpTextures, useCanvasRenderer } from "../../utils/blpLoader";
import { useCurrentRace } from "../../state/race";
import { useGoldCurrent, useLumberCurrent } from "../../state/resources";
import "./style.css";

type SlotType = "gold" | "lumber" | "supply";

function ResourceSlot({ type }: { type: SlotType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const race = useCurrentRace();
  const gold = useGoldCurrent();
  const lumber = useLumberCurrent();

  const path =
    type === "gold"
      ? "resources/ResourceGold.blp"
      : type === "lumber"
        ? "resources/ResourceLumber.blp"
        : `resources/Resource${race}.blp`;

  const tex = useBlpTextures({ icon: path });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!tex) return;
      ctx.drawImage(tex.icon, 0, 0, w, h);
    },
    [tex],
  );

  useCanvasRenderer(canvasRef, draw, [tex]);

  const value =
    type === "gold" ? gold : type === "lumber" ? lumber : "50 / 80";

  return (
    <div className="wc-resource-slot">
      <canvas ref={canvasRef} className="wc-resource-icon" />
      <span className="wc-res-value">{value}</span>
    </div>
  );
}

export default function ResourceCounter() {
  return (
    <div className="wc-resources">
      <ResourceSlot type="gold" />
      <ResourceSlot type="lumber" />
      <ResourceSlot type="supply" />
      <span className="wc-upkeep-text wc-upkeep-green">No Upkeep</span>
    </div>
  );
}
