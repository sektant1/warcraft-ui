type Rgb = [number, number, number];

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const c = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * c),
    Math.round(a[1] + (b[1] - a[1]) * c),
    Math.round(a[2] + (b[2] - a[2]) * c),
  ];
}

function rgbHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** WC3-style health colour for a 0–100 percentage: red → yellow → green. */
export function healthColor(pct: number): string {
  const p = Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0));
  const low: Rgb = [220, 42, 22];
  const mid: Rgb = [238, 201, 46];
  const high: Rgb = [67, 213, 61];
  if (p <= 35) return rgbHex(mixRgb(low, mid, p / 35));
  return rgbHex(mixRgb(mid, high, (p - 35) / 65));
}
