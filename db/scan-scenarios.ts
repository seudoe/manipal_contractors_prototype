import type { ScanScenario } from "@/types/verification";

/**
 * ANUBANDH prototype addition — each scenario is a pre-authored playback of
 * what a field scan would produce. No actual signature verification or
 * matching happens anywhere in this prototype; the gate-scan screen just
 * reveals these fixed fields in stages. See plan.md/update (1).md TASK 1.16.
 */
export const scanScenarios: ScanScenario[] = [
  {
    id: "scan-1",
    label: "Approved quarry - clean",
    description: "Aggregate delivery invoice from the approved vendor, all checks pass.",
    signatureValid: true,
    signatureNote: "Digital signature valid — issued by the GST Network.",
    payload: {
      sellerGstin: "27ABCDE1234F1Z5",
      sellerName: "Quarry Q-114",
      buyerGstin: "27PQRS5678H1Z9",
      docNo: "INV-88231",
      docDate: "2026-08-20",
      totalValue: "Rs 3,42,000",
      itemCount: "1",
      mainHsn: "2517",
      irn: "IRN9a1d4f7b0c3e6295",
    },
    checks: [
      { label: "Seller GSTIN", expected: "27ABCDE1234F1Z5 (Quarry Q-114)", found: "27ABCDE1234F1Z5", pass: true },
      { label: "Vendor approval status", expected: "Active on approved vendor list", found: "Active", pass: true },
      { label: "Buyer GSTIN", expected: "27PQRS5678H1Z9 (Riverside Metro site)", found: "27PQRS5678H1Z9", pass: true },
      { label: "HSN code", expected: "2517 (stone aggregates)", found: "2517", pass: true },
    ],
    resultGateEventId: "ge-1",
  },
  {
    id: "scan-2",
    label: "Wrong supplier",
    description: "Aggregate delivery invoice from a seller not on the approved vendor list.",
    signatureValid: true,
    signatureNote: "Digital signature is cryptographically valid — the invoice is genuinely signed, just by the wrong seller.",
    payload: {
      sellerGstin: "27XYZQ9988K1Z2",
      sellerName: "Shree Balaji Minerals",
      buyerGstin: "27PQRS5678H1Z9",
      docNo: "INV-55190",
      docDate: "2026-09-10",
      totalValue: "Rs 14,20,000",
      itemCount: "1",
      mainHsn: "2517",
      irn: "IRN7f3a1c9e2b4d6081",
    },
    checks: [
      { label: "Seller GSTIN", expected: "27ABCDE1234F1Z5 (Quarry Q-114)", found: "27XYZQ9988K1Z2 (Shree Balaji Minerals)", pass: false },
      { label: "Vendor approval status", expected: "Active on approved vendor list", found: "Not on approved vendor list", pass: false },
      { label: "Buyer GSTIN", expected: "27PQRS5678H1Z9", found: "27PQRS5678H1Z9", pass: true },
      { label: "HSN code", expected: "2517", found: "2517", pass: true },
    ],
    resultGateEventId: "ge-3",
  },
  {
    id: "scan-3",
    label: "Diverted consignment",
    description: "Approved-vendor invoice, but the buyer GSTIN belongs to a different site.",
    signatureValid: true,
    signatureNote: "Digital signature valid, but the consignment was billed to a different project's site.",
    payload: {
      sellerGstin: "27ABCDE1234F1Z5",
      sellerName: "Quarry Q-114",
      buyerGstin: "27LMNO2233J1Z4",
      docNo: "INV-88350",
      docDate: "2026-09-12",
      totalValue: "Rs 8,90,000",
      itemCount: "1",
      mainHsn: "2517",
      irn: "IRN4d8b1a6e3c9f0275",
    },
    checks: [
      { label: "Seller GSTIN", expected: "27ABCDE1234F1Z5", found: "27ABCDE1234F1Z5", pass: true },
      { label: "Buyer GSTIN", expected: "27PQRS5678H1Z9 (Riverside Metro site)", found: "27LMNO2233J1Z4 (different site)", pass: false },
      { label: "HSN code", expected: "2517", found: "2517", pass: true },
    ],
    resultGateEventId: "ge-7",
  },

  // ---- ANUBANDH addition (TASK 9) — deploy checkpoint, SBOM payload instead of an invoice ----
  {
    id: "scan-deploy-1",
    label: "Production deploy",
    description: "SBOM scan for release 4.3.0 ahead of the production deploy gate.",
    signatureValid: true,
    signatureNote: "SBOM signature valid — the document itself is authentic, the finding is in its contents.",
    payload: {
      packageName: "citizen-portal-web",
      packageVersion: "4.3.0",
      subprocessor: "CloudRegion-EU-West",
      dataResidency: "Outside India",
      dependencyCount: "312",
      sbomHash: "b2e5a8d1c4f7906ab2e5a8d1c4f7906a",
    },
    checks: [
      { label: "Data residency", expected: "All subprocessors hosted in India", found: "CloudRegion-EU-West (outside India)", pass: false },
      { label: "Package list match", expected: "Approved Package List v4.2", found: "312 dependencies, 1 unlisted subprocessor", pass: false },
      { label: "SBOM signature", expected: "Valid, current build", found: "Valid", pass: true },
    ],
    resultGateEventId: "ge-8",
  },
];
