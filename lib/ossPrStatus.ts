import type { OssPrStatus } from "@prisma/client";

export const OSS_PR_STATUS_ORDER: OssPrStatus[] = [
  "NOT_STARTED",
  "RESEARCHING_ISSUE",
  "IN_PROGRESS",
  "SUBMITTED",
  "MERGED",
];

export const OSS_PR_STATUS_LABELS: Record<OssPrStatus, string> = {
  NOT_STARTED: "Not started",
  RESEARCHING_ISSUE: "Researching issue",
  IN_PROGRESS: "In progress",
  SUBMITTED: "Submitted",
  MERGED: "Merged",
};
