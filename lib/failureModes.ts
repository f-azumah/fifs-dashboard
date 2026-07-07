import type { FailureMode } from "@prisma/client";

export const FAILURE_MODE_ORDER: FailureMode[] = [
  "INERTIA",
  "MIND_BODY_GAP",
  "TECHNICAL_WALL",
  "PLANNING_FATIGUE",
];

export const FAILURE_MODE_LABELS: Record<FailureMode, string> = {
  INERTIA: "Inertia",
  MIND_BODY_GAP: "Mind-body gap",
  TECHNICAL_WALL: "Technical wall",
  PLANNING_FATIGUE: "Planning fatigue",
};
