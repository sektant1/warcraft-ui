import { useEffect, useState } from "react";

export type BarKey = "hp" | "mp" | "xp" | "build" | "load";

/** Per-bar step (percentage points) and tick interval (ms). */
const BAR_SPEEDS: Record<BarKey, { step: number; interval: number }> = {
  hp: { step: 0.8, interval: 120 },
  mp: { step: 1.2, interval: 90 },
  xp: { step: 0.5, interval: 150 },
  build: { step: 1.5, interval: 100 },
  load: { step: 0.6, interval: 130 },
};

const INITIAL: Record<BarKey, number> = { hp: 75, mp: 40, xp: 20, build: 55, load: 30 };

/**
 * Demo helper: a set of 0–100 values that loop upward while `running`.
 * When paused they can be set manually via `setValue`.
 */
export function useAnimatedBars(running: boolean) {
  const [values, setValues] = useState(INITIAL);

  useEffect(() => {
    if (!running) return;
    const timers = (Object.keys(BAR_SPEEDS) as BarKey[]).map((key) => {
      const { step, interval } = BAR_SPEEDS[key];
      return setInterval(() => {
        setValues((v) => ({ ...v, [key]: v[key] >= 100 ? 0 : Math.min(100, v[key] + step) }));
      }, interval);
    });
    return () => timers.forEach(clearInterval);
  }, [running]);

  const setValue = (key: BarKey, pct: number) =>
    setValues((v) => ({ ...v, [key]: Math.max(0, Math.min(100, pct)) }));

  return { values, setValue };
}
