/**
 * Types for bill verification and invoice history screens.
 * Purely presentation types — all statuses and verification flags
 * are authored in db/bill-scans.ts and db/bills.ts.
 */

export type BillScanVerdict = "accepted" | "needs-evidence" | "blocked";

export type BillCheckResult = "pass" | "fail" | "warning";

export interface BillScanCheck {
  label: string;
  expected: string;
  found: string;
  result: BillCheckResult;
}

export interface BillInvoiceData {
  supplierName: string;
  supplierTaxId: string;
  buyerName: string;
  buyerTaxId: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalValue: string;
  lineItemCount: number;
  materialCategory: string;
  referenceNumber: string;
}

export interface BillScanScenario {
  id: string;
  label: string;
  shortDescription: string;
  registrationValid: boolean;
  registrationNote: string;
  invoice: BillInvoiceData;
  checks: BillScanCheck[];
  verdict: BillScanVerdict;
  verdictHeadline: string;
  verdictExplanation: string;
  amountAtRisk: number;
  timeRemaining: string;
  linkedIssueId: string | null;
  linkedCommitmentId: string | null;
}

export type BillStatus = "verified" | "flagged" | "pending";

export interface BillRecord {
  id: string;
  projectId: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  supplierTaxId: string;
  materialCategory: string;
  quantity: number;
  unit: string;
  totalValue: number;
  status: BillStatus;
  flagReason: string | null;
  linkedIssueId: string | null;
  registrationVerified: boolean;
  scannedBy: string;
  scannedAt: string;
}
