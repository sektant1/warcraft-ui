import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function EscRadioButton({ label, selected, onSelect }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const renderer = useRenderer();

  useEffect(() => {
    renderer.radios.push({
      ref: () => outerRef.current!,
      visualRef: () => visualRef.current!,
      selected: () => selectedRef.current,
    });
  }, []);

  return (
    <div
      ref={outerRef}
      className={`wc-radio${selected ? " wc-radio--selected" : ""}`}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === " " && onSelect()}
    >
      <span ref={visualRef} className="wc-radio-visual" />
      <span className="wc-radio-label">{label}</span>
    </div>
  );
}
