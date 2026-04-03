import { useEffect, useRef } from 'react';
import { useRenderer } from '../../context/RendererContext';
import { useGoldCurrent, useLumberCurrent } from '../../state/resources';
import './style.css';

type SlotType = 'gold' | 'lumber' | 'supply';

function ResourceSlot({ type }: { type: SlotType }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const renderer = useRenderer();
  const gold = useGoldCurrent();
  const lumber = useLumberCurrent();

  useEffect(() => {
    renderer.resourceIcons.push({
      ref: () => anchorRef.current!,
      type,
    });
  }, []);

  const value = type === 'gold' ? gold
    : type === 'lumber' ? lumber
    : '50 / 80';

  return (
    <div className="wc-resource-slot">
      <span ref={anchorRef} className="wc-resource-icon" />
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
