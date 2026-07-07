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
