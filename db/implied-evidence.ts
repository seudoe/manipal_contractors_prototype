/**
 * ANUBANDH prototype addition — hand-authored per project, not computed.
 * Only projects with a physical delivery record (concrete, in this case)
 * get one; the expectations screen simply omits the panel when there is
 * none for the current project, so this stays project-agnostic rather than
 * a construction-specific conditional baked into the component.
 */
export interface ImpliedEvidence {
  projectId: string;
  deliveredLabel: string;
  deliveredValue: string;
  expectedTestsLabel: string;
  expectedTestsValue: string;
  onFileLabel: string;
  onFileValue: string;
  shortfallLabel: string;
  shortfallValue: string;
  caption: string;
}

export const impliedEvidenceRecords: ImpliedEvidence[] = [
  {
    projectId: "project-1",
    deliveredLabel: "Concrete delivered",
    deliveredValue: "612 cum",
    expectedTestsLabel: "Cube tests that should exist",
    expectedTestsValue: "20",
    onFileLabel: "Lab certificates on file",
    onFileValue: "19",
    shortfallLabel: "Shortfall",
    shortfallValue: "1",
    caption:
      "Delivery records tell you how many tests must exist, so a shortfall shows up even when nobody reports it themselves.",
  },
];
