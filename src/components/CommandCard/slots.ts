import type { CommandSlot } from "./CommandCard";

/** Create an array of empty command card slots (default: a full 4×3 card). */
export function createEmptySlots(count = 12): CommandSlot[] {
  return Array.from({ length: count }, () => ({ state: "empty" as const }));
}
