import type { Override } from "@/types/deviation";

/**
 * ANUBANDH prototype addition — 2 seeded named-accountability overrides.
 * hash/prevHash are hardcoded-looking hex strings for display only; no real
 * hash chain is computed anywhere in this prototype. See
 * plan.md/update (1).md TASK 1.14.
 */
export const overrides: Override[] = [
  {
    id: "ovr-1",
    gateEventId: "ge-4",
    officerName: "Meera Iyer",
    reason:
      "Crew credentials re-verified manually against physical ID cards on-site; work permitted to continue pending formal credential reissue from ElectroWorks.",
    at: "2026-09-11T08:00:00.000Z",
    hash: "a4e7c1f0d8b25936a4e7c1f0d8b25936",
    prevHash: "0000000000000000000000000000000",
  },
  {
    id: "ovr-2",
    gateEventId: "ge-6",
    officerName: "Karan Bhatt",
    reason:
      "Alternate quarry temporarily approved after telephonic confirmation from the project stakeholder; documented post-hoc pending vendor list update.",
    at: "2025-07-15T10:00:00.000Z",
    hash: "c1f0d8b25936a4e7c1f0d8b25936a4e7",
    prevHash: "a4e7c1f0d8b25936a4e7c1f0d8b25936",
  },
];
