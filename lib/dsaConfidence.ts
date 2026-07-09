import type { DsaConfidence } from "@prisma/client";

export const DSA_CONFIDENCE_ORDER: DsaConfidence[] = [
  "SHAKY",
  "GETTING_THERE",
  "SOLID",
];

export const DSA_CONFIDENCE_LABELS: Record<DsaConfidence, string> = {
  SHAKY: "Shaky",
  GETTING_THERE: "Getting there",
  SOLID: "Solid",
};
