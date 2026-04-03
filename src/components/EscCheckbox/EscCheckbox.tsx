import { useEffect, useRef, useState } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function EscCheckbox({ label, checked: controlledChecked, onChange }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const renderer = useRenderer();
  const [internalChecked, setInternalChecked] = useState(controlledChecked ?? false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    renderer.checkboxes.push({
      ref: () => outerRef.current!,
      visualRef: () => visualRef.current!,
      checked: () => (isControlled ? (controlledChecked ?? false) : internalChecked),
    });
  }, []);

  const toggle = () => {
    if (isControlled) {
      onChange?.(!checked);
    } else {
      setInternalChecked((v) => {
        onChange?.(!v);
        return !v;
      });
    }
  };

  return (
    <div
      ref={outerRef}
      className={`wc-checkbox${checked ? " wc-checkbox--checked" : ""}`}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => e.key === " " && toggle()}
    >
      <span ref={visualRef} className="wc-checkbox-visual" />
      <span className="wc-checkbox-label">{label}</span>
    </div>
  );
}
