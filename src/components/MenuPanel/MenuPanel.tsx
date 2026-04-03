import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  variant?: "menu" | "cinematic";
  style?: React.CSSProperties;
}

export default function MenuPanel({ variant = "menu", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    const reg = { ref: () => ref.current!, variant };
    renderer.menuPanels.push(reg);
    return () => {
      const idx = renderer.menuPanels.indexOf(reg);
      if (idx >= 0) renderer.menuPanels.splice(idx, 1);
    };
  }, [renderer, variant]);

  return <div ref={ref} className="wc-menu-panel" style={style} />;
}
