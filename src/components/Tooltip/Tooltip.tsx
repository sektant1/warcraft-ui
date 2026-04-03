import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  children: React.ReactNode;
}

export default function Tooltip({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    const reg = { ref: () => ref.current! };
    renderer.tooltips.push(reg);
    return () => {
      const idx = renderer.tooltips.indexOf(reg);
      if (idx >= 0) renderer.tooltips.splice(idx, 1);
    };
  }, [renderer]);

  return (
    <div ref={ref} className="wc-tooltip">
      <div className="wc-tt-content">{children}</div>
    </div>
  );
}
