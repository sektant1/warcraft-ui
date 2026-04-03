import { useEffect, useRef, useState } from "react";
import { useRenderer } from "../../context/RendererContext";
import "./style.css";

interface Props {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function EscCheckbox({ label, checked: controlledChecked, disabled = false, onChange }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLSpanElement>(null);
  const renderer = useRenderer();
  const [internalChecked, setInternalChecked] = useState(controlledChecked ?? false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const checkedRef = useRef(checked);
  checkedRef.current = checked;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    const reg = {
      ref: () => outerRef.current!,
      visualRef: () => visualRef.current!,
      checked: () => checkedRef.current,
      disabled: () => disabledRef.current,
    };
    renderer.checkboxes.push(reg);
    return () => {
      const idx = renderer.checkboxes.indexOf(reg);
      if (idx >= 0) renderer.checkboxes.splice(idx, 1);
    };
  }, [renderer]);

  const toggle = () => {
    if (disabled) return;
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
      className={`wc-checkbox${checked ? " wc-checkbox--checked" : ""}${disabled ? " wc-checkbox--disabled" : ""}`}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => e.key === " " && toggle()}
    >
      <span ref={visualRef} className="wc-checkbox-visual" />
      <span className="wc-checkbox-label">{label}</span>
    </div>
  );
}
