import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  label?: string;
  type: "health" | "mana" | "xp" | "build";
  fillPercent: number;
  maxValue?: number;
  height?: number;
  hasBorder?: boolean;
}

export default function StatBar({ label, type, fillPercent, maxValue, height = 18, hasBorder = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();
  const fillRef = useRef(fillPercent);
  fillRef.current = fillPercent;

  useEffect(() => {
    const reg = {
      ref: () => ref.current!,
      fillPercent: () => fillRef.current,
      type,
      hasBorder,
    };
    renderer.statBars.push(reg);
    return () => {
      const idx = renderer.statBars.indexOf(reg);
      if (idx >= 0) renderer.statBars.splice(idx, 1);
    };
  }, [renderer, type, hasBorder]);

  const barText = () => {
    const pct = fillPercent;
    if (type === "build") return pct + "%";
    if (maxValue) {
      return Math.floor((maxValue * pct) / 100) + "\u00a0/ " + maxValue;
    }
    return pct + "%";
  };

  return (
    <div className="wc-bar-row">
      {label && <span className="wc-bar-label">{label}</span>}
      <div ref={ref} className="wc-stat-bar" style={{ height: height + "px" }}>
        <div
          className={`wc-bar-fill ${type}-fill`}
          style={{ width: fillPercent + "%" }}
        />
        {hasBorder && <img className="wc-bar-border-overlay" src="" alt="" />}
        <div className="wc-bar-text" style={height < 18 ? { fontSize: "0.6rem" } : undefined}>
          {barText()}
        </div>
      </div>
    </div>
  );
}
