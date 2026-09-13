"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import type { BillRecord, BillStatus } from "@/types/bill";
import { EmptyState } from "@/components/anubandh/empty-state";

export function BillHistoryView({
  bills,
  projectId,
}: {
  bills: BillRecord[];
  projectId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "ALL">("ALL");
  const [selectedBill, setSelectedBill] = useState<BillRecord | null>(null);

  const suppliers = useMemo(() => {
    return Array.from(new Set(bills.map((b) => b.supplierName)));
  }, [bills]);

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (supplierFilter !== "ALL" && b.supplierName !== supplierFilter) return false;
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesNumber = b.invoiceNumber.toLowerCase().includes(query);
        const matchesSupplier = b.supplierName.toLowerCase().includes(query);
        const matchesCategory = b.materialCategory.toLowerCase().includes(query);
        const matchesTaxId = b.supplierTaxId.toLowerCase().includes(query);
        if (!matchesNumber && !matchesSupplier && !matchesCategory && !matchesTaxId) {
          return false;
        }
      }
      return true;
    });
  }, [bills, supplierFilter, statusFilter, searchQuery]);

  // Plain summary totals
  const totalInvoices = bills.length;
  const totalValue = bills.reduce((acc, b) => acc + b.totalValue, 0);
  const flaggedCount = bills.filter((b) => b.status === "flagged").length;

  const statusChipStyles: Record<BillStatus, string> = {
    verified:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
    flagged:
      "bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
    pending:
      "bg-zinc-100 text-zinc-600 border border-zinc-200/60 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/60",
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Contract invoice history
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Complete audit trail of all tax invoices registered and verified against this contract.
        </p>
      </div>

      {/* Summary Row: Plain large numbers with grey labels, no cards or borders */}
      <div className="flex flex-wrap items-baseline gap-8 sm:gap-12 border-b border-black/10 pb-5 dark:border-white/10">
        <div>
          <span className="text-2xl sm:text-3xl font-semibold text-black dark:text-zinc-50">
            {totalInvoices}
          </span>
          <span className="ml-2.5 text-xs text-zinc-500">total invoices</span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-semibold text-black dark:text-zinc-50">
            Rs {totalValue.toLocaleString("en-IN")}
          </span>
          <span className="ml-2.5 text-xs text-zinc-500">total registered value</span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-semibold text-black dark:text-zinc-50">
            {flaggedCount}
          </span>
          <span className="ml-2.5 text-xs text-zinc-500">flagged records</span>
        </div>
      </div>

      {/* Filter Row: Search, Supplier, Status */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number, supplier or category..."
            className="w-full rounded-md border border-black/10 bg-transparent pl-9 pr-3 py-1.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:focus:ring-white"
          />
        </div>

        <select
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
          className="rounded-md border border-black/10 bg-transparent px-3 py-1.5 text-sm dark:border-white/10"
        >
          <option value="ALL">All suppliers</option>
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BillStatus | "ALL")}
          className="rounded-md border border-black/10 bg-transparent px-3 py-1.5 text-sm dark:border-white/10"
        >
          <option value="ALL">All statuses</option>
          <option value="verified">Verified</option>
          <option value="flagged">Flagged</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Invoices Table */}
      {filteredBills.length === 0 ? (
        <EmptyState
          title="No invoices found matching criteria"
          description="Try adjusting your search terms or clearing the status filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-zinc-50/80 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-white/10 dark:bg-zinc-900">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Invoice number</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className="hover:bg-zinc-50/80 cursor-pointer transition-colors dark:hover:bg-zinc-900/60"
                >
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {bill.invoiceDate}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-medium text-black dark:text-zinc-50 whitespace-nowrap">
                    {bill.invoiceNumber}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-black dark:text-zinc-50">
                    {bill.supplierName}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-300">
                    {bill.materialCategory}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                    {bill.quantity} {bill.unit}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-800 dark:text-zinc-200 font-medium whitespace-nowrap">
                    Rs {bill.totalValue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusChipStyles[bill.status]
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Detail Drawer / Modal */}
      {selectedBill && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/15 dark:bg-zinc-950 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-semibold text-black dark:text-zinc-50">
                    {selectedBill.invoiceNumber}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      statusChipStyles[selectedBill.status]
                    }`}
                  >
                    {selectedBill.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Recorded on {selectedBill.invoiceDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Flag Reason if any */}
            {selectedBill.flagReason && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-xs uppercase tracking-wide">
                    Compliance notice
                  </span>
                  <p className="text-xs leading-relaxed">{selectedBill.flagReason}</p>
                </div>
              </div>
            )}

            {/* Full Plain Key/Value Fields List */}
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-sm">
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Supplier organization</span>
                <span className="font-medium text-black dark:text-zinc-50 text-right">
                  {selectedBill.supplierName}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Supplier tax identifier</span>
                <span className="font-mono text-xs font-medium text-black dark:text-zinc-50">
                  {selectedBill.supplierTaxId}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Category description</span>
                <span className="font-medium text-black dark:text-zinc-50 text-right">
                  {selectedBill.materialCategory}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Delivered volume</span>
                <span className="font-medium text-black dark:text-zinc-50">
                  {selectedBill.quantity} {selectedBill.unit}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Total invoice value</span>
                <span className="font-semibold text-black dark:text-zinc-50">
                  Rs {selectedBill.totalValue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Registry status</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck size={14} />
                  Independent government registration verified
                </span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-zinc-500">Intake logging</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 text-right">
                  {selectedBill.scannedBy} ({selectedBill.scannedAt})
                </span>
              </div>
            </div>

            {/* Contextual link to linked issue if one exists */}
            {selectedBill.linkedIssueId && (
              <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Linked contract deviation</span>
                <Link
                  href={`/inspector/project/${projectId}/deviations/${selectedBill.linkedIssueId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-black dark:text-zinc-50 underline hover:opacity-80"
                >
                  Open case file {selectedBill.linkedIssueId}
                  <ExternalLink size={13} />
                </Link>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
