import { useEffect, useRef } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function EscEditBox({ value, placeholder, onChange }: Props) {
  const outerRef = useRef<HTMLLabelElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    const reg = { ref: () => outerRef.current! };
    renderer.editBoxes.push(reg);
    return () => {
      const idx = renderer.editBoxes.indexOf(reg);
      if (idx >= 0) renderer.editBoxes.splice(idx, 1);
    };
  }, [renderer]);

  return (
    <label ref={outerRef} className="wc3-editbox wc3-editbox--esc">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </label>
  );
}
