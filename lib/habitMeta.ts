import type { HabitCategory } from "@prisma/client";

export const CATEGORY_ORDER: HabitCategory[] = [
  "HEALTH_FITNESS",
  "MIND_SPIRITUAL",
  "WORK",
  "PERSONAL",
  "HAIR_CARE",
];

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  HEALTH_FITNESS: "Health & Fitness",
  MIND_SPIRITUAL: "Mind & Spiritual",
  WORK: "Work",
  PERSONAL: "Personal",
  HAIR_CARE: "Hair Care",
};

// Small dot next to each category heading — decorative only.
export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  HEALTH_FITNESS: "#B5657A",
  MIND_SPIRITUAL: "#7FB2A6",
  WORK: "#C2A468",
  PERSONAL: "#ADA0CB",
  HAIR_CARE: "#D89B96",
};

// Rotating palette assigned per-habit (checkboxes, progress bars) so each
// habit reads as visually distinct, independent of its category.
export const HABIT_COLOR_PALETTE = [
  "#D9A0B3", // muted pink
  "#D9C17A", // muted yellow
  "#D9A468", // muted orange
  "#7FB2A6", // muted teal
  "#9CB68A", // muted sage
  "#8FA8C7", // muted blue
  "#B5657A", // muted rose
];

export function habitColorFor(habitId: string, index: number, explicit?: string | null): string {
  if (explicit) return explicit;
  return HABIT_COLOR_PALETTE[index % HABIT_COLOR_PALETTE.length];
}
