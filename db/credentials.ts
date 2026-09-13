import type { CommitmentCredential } from "@/types/commitment";

/**
 * ANUBANDH prototype addition — one credential per named party referenced by
 * project-1's commitments, plus one REVOKED credential so a credential
 * failure is demoable (the unapproved subcontractor on the identity
 * commitment, cm-3). See plan.md/update (1).md TASK 1.9.
 */
export const credentials: CommitmentCredential[] = [
  {
    id: "cred-1",
    commitmentId: "cm-1",
    partyName: "BuildCorp",
    role: "Main contractor",
    status: "ACTIVE",
    issuedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "cred-2",
    commitmentId: "cm-3",
    partyName: "ElectroWorks",
    role: "Approved electrical subcontractor",
    status: "ACTIVE",
    issuedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "cred-3",
    commitmentId: "cm-2",
    partyName: "Quarry Q-114",
    role: "Approved aggregate vendor",
    status: "ACTIVE",
    issuedAt: "2025-02-01T00:00:00.000Z",
  },
  {
    id: "cred-4",
    commitmentId: "cm-12",
    partyName: "ElectroWorks",
    role: "Approved electrical subcontractor",
    status: "ACTIVE",
    issuedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "cred-5",
    commitmentId: "cm-9",
    partyName: "BuildCorp",
    role: "Main contractor",
    status: "ACTIVE",
    issuedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "cred-6",
    commitmentId: "cm-3",
    partyName: "Rapid Electricals",
    role: "Unapproved electrical labour supplier",
    status: "REVOKED",
    issuedAt: "2024-11-02T00:00:00.000Z",
  },

  // ---- ANUBANDH addition (TASK 9) — project-4 ----
  {
    id: "cred-7",
    commitmentId: "cm-14",
    partyName: "Ananth Iyer",
    role: "Lead Architect",
    status: "ACTIVE",
    issuedAt: "2025-10-15T00:00:00.000Z",
  },
  {
    id: "cred-8",
    commitmentId: "cm-18",
    partyName: "Rohan Desai",
    role: "DevOps Lead",
    status: "ACTIVE",
    issuedAt: "2025-10-15T00:00:00.000Z",
  },
  {
    id: "cred-9",
    commitmentId: "cm-18",
    partyName: "Deepak Shah",
    role: "External contributor (uncredentialed)",
    status: "REVOKED",
    issuedAt: "2025-08-01T00:00:00.000Z",
  },
];
