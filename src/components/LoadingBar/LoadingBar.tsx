import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  progress: number;
}

export default function LoadingBar({ progress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const reg = {
      ref: () => ref.current!,
      fillRef: () => fillRef.current!,
      fillPercent: () => Math.min(progressRef.current, 98),
    };
    renderer.loadingBars.push(reg);
    return () => {
      const idx = renderer.loadingBars.indexOf(reg);
      if (idx >= 0) renderer.loadingBars.splice(idx, 1);
    };
  }, [renderer]);

  return (
    <div ref={ref} className="wc-loading-bar">
      <div className="wc-lb-bg" />
      <div
        ref={fillRef}
        className="wc-lb-fill"
        style={{ width: Math.min(progress, 98) + "%" }}
      />
      <img className="wc-lb-border" src="" alt="" />
      <img className="wc-lb-glass" src="" alt="" />
      <div className="wc-lb-text">{Math.floor(progress)}%</div>
    </div>
  );
}
