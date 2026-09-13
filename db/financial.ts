/**
 * ANUBANDH prototype addition — every figure here is hand-authored for
 * project-1. Nothing is computed: claimGap is a fixed number, not
 * claimedPercent - observedPercent (even though, by construction, they
 * agree — that's authorial intent, not a live formula). See
 * plan.md/update (1).md TASK 1.15.
 */

export interface FinancialCurvePoint {
  month: string;
  value: number;
}

export interface TripleEntryPeriod {
  period: string;
  money: boolean;
  material: boolean;
  work: boolean;
  pattern: string;
  interpretation: string;
  flagged: boolean;
}

export interface ProjectFinancial {
  projectId: string;
  claimedPercent: number;
  observedPercent: number;
  claimGap: number;
  claimedCurve: FinancialCurvePoint[];
  observedCurve: FinancialCurvePoint[];
  cpi: number;
  costToComplete: number;
  tripleEntry: TripleEntryPeriod[];
}

export const financials: ProjectFinancial[] = [
  {
    projectId: "project-1",
    claimedPercent: 38,
    observedPercent: 19,
    claimGap: 19,
    claimedCurve: [
      { month: "Mar", value: 4 },
      { month: "Apr", value: 9 },
      { month: "May", value: 15 },
      { month: "Jun", value: 21 },
      { month: "Jul", value: 27 },
      { month: "Aug", value: 33 },
      { month: "Sep", value: 38 },
    ],
    observedCurve: [
      { month: "Mar", value: 4 },
      { month: "Apr", value: 8 },
      { month: "May", value: 11 },
      { month: "Jun", value: 13 },
      { month: "Jul", value: 15 },
      { month: "Aug", value: 17 },
      { month: "Sep", value: 19 },
    ],
    cpi: 0.71,
    costToComplete: 412_000_000,
    tripleEntry: [
      {
        period: "Jun 2026",
        money: true,
        material: true,
        work: true,
        pattern: "Aligned",
        interpretation: "Money, material and physical work all moved together — no flags.",
        flagged: false,
      },
      {
        period: "Jul 2026",
        money: true,
        material: true,
        work: true,
        pattern: "Aligned",
        interpretation: "Consistent progress across all three entries this period.",
        flagged: false,
      },
      {
        period: "Aug 2026",
        money: true,
        material: true,
        work: false,
        pattern: "Material + money without work",
        interpretation:
          "Payment was released and material was delivered, but independently observed physical progress did not move — the classic sign of a claim running ahead of the site.",
        flagged: true,
      },
      {
        period: "Sep 2026",
        money: true,
        material: false,
        work: false,
        pattern: "Money without material or work",
        interpretation:
          "Payment moved this period with neither a matching material delivery nor observed work — needs reconciliation before the next claim is certified.",
        flagged: false,
      },
    ],
  },

  // ---- ANUBANDH addition (TASK 9/11) — project-4, so the financial screen works for both domains ----
  {
    projectId: "project-4",
    claimedPercent: 62,
    observedPercent: 55,
    claimGap: 7,
    claimedCurve: [
      { month: "Mar", value: 20 },
      { month: "Apr", value: 30 },
      { month: "May", value: 40 },
      { month: "Jun", value: 48 },
      { month: "Jul", value: 55 },
      { month: "Aug", value: 60 },
      { month: "Sep", value: 62 },
    ],
    observedCurve: [
      { month: "Mar", value: 20 },
      { month: "Apr", value: 28 },
      { month: "May", value: 36 },
      { month: "Jun", value: 43 },
      { month: "Jul", value: 48 },
      { month: "Aug", value: 52 },
      { month: "Sep", value: 55 },
    ],
    cpi: 0.94,
    costToComplete: 38_000_000,
    tripleEntry: [
      {
        period: "Jul 2026",
        money: true,
        material: true,
        work: true,
        pattern: "Aligned",
        interpretation: "Payment, sprint delivery, and merged commits all moved together.",
        flagged: false,
      },
      {
        period: "Aug 2026",
        money: true,
        material: true,
        work: true,
        pattern: "Aligned",
        interpretation: "Consistent progress across billing, delivery, and commit activity.",
        flagged: false,
      },
      {
        period: "Sep 2026",
        money: true,
        material: true,
        work: false,
        pattern: "Material + money without work",
        interpretation:
          "Payment released and a release was tagged, but commit activity from named personnel did not match — see the personnel deviation for detail.",
        flagged: true,
      },
    ],
  },
];
