"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Check, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import type { BillScanScenario, BillScanVerdict } from "@/types/bill";

export function BillScanView({
  scenarios,
  projectId,
}: {
  scenarios: BillScanScenario[];
  projectId: string;
}) {
  // Pre-select the main demo scenario (bill-scan-2) or first scenario so checks are visible immediately on page load
  const defaultScenarioId = scenarios[1]?.id ?? scenarios[0]?.id ?? null;
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(defaultScenarioId);
  const [revealStage, setRevealStage] = useState<number>(4);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  const handleSelectScenario = (id: string) => {
    // Clear any ongoing stage timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setSelectedScenarioId(id);
    setRevealStage(1);

    // Stage 1: Registration check
    // Stage 2: Invoice details (after 400ms)
    // Stage 3: Check list (after 850ms)
    // Stage 4: Verdict banner (after 1300ms)
    const t1 = setTimeout(() => setRevealStage(2), 450);
    const t2 = setTimeout(() => setRevealStage(3), 900);
    const t3 = setTimeout(() => setRevealStage(4), 1350);

    timerRef.current = [t1, t2, t3];
  };

  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout);
    };
  }, []);

  const verdictStyles: Record<
    BillScanVerdict,
    { border: string; bg: string; text: string; subtext: string; pill: string }
  > = {
    accepted: {
      border: "border-emerald-200 dark:border-emerald-800/80",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
      text: "text-emerald-950 dark:text-emerald-100",
      subtext: "text-emerald-800/90 dark:text-emerald-200/80",
      pill: "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    },
    "needs-evidence": {
      border: "border-amber-200 dark:border-amber-800/80",
      bg: "bg-amber-50/70 dark:bg-amber-950/30",
      text: "text-amber-950 dark:text-amber-100",
      subtext: "text-amber-800/90 dark:text-amber-200/80",
      pill: "bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    },
    blocked: {
      border: "border-rose-200 dark:border-rose-800/80",
      bg: "bg-rose-50/70 dark:bg-rose-950/30",
      text: "text-rose-950 dark:text-rose-100",
      subtext: "text-rose-800/90 dark:text-rose-200/80",
      pill: "bg-rose-100/80 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
    },
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Supplier tax invoice verification
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Verify delivered consignments against contract commitments using government registered tax invoices.
        </p>
      </div>

      {/* Camera simulation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-slate-50/60 px-4 py-3 dark:border-indigo-800/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
          >
            <Camera size={15} strokeWidth={1.75} />
            Use camera
          </button>
          <span className="text-xs text-slate-500">
            Hardware camera scan is simulated in this prototype. Select a scenario below to run intake verification.
          </span>
        </div>

        {/* Note: This is a statement about the real verification mechanism, not something this prototype implements. */}
        <span className="text-xs text-slate-500 font-medium">
          Offline verification active — operates without an active network connection
        </span>
      </div>

      {/* Scenario Selection Buttons */}
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Select delivery scenario
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => handleSelectScenario(scenario.id)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-colors ${
                  isSelected
                    ? "border-black bg-slate-50 dark:border-white dark:bg-slate-900"
                    : "border-indigo-200 bg-white hover:bg-slate-50/80 dark:border-indigo-800/40 dark:bg-slate-950 dark:hover:bg-slate-900/60"
                }`}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {scenario.label}
                </span>
                <span className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {scenario.shortDescription}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Scenario Verification Playback */}
      {selectedScenario && (
        <div className="flex flex-col gap-6 pt-2">
          {/* Stage 1: Government Registration Check */}
          {revealStage >= 1 && (
            <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800/40 dark:bg-slate-950 transition-opacity duration-300">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                  <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Stage 1: Government registry verification
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.registrationValid
                      ? "Cryptographic invoice record confirmed"
                      : "Registration unconfirmed"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedScenario.registrationNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Invoice Details as a plain two-column key/value list */}
          {revealStage >= 2 && (
            <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800/40 dark:bg-slate-950 transition-opacity duration-300">
              <div className="mb-3 border-b border-black/5 pb-2 dark:border-white/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Stage 2: Invoice details
                </p>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Supplier name</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.supplierName}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Supplier tax identifier</span>
                  <span className="font-mono text-xs font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.supplierTaxId}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Billed customer</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.buyerName}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Customer tax identifier</span>
                  <span className="font-mono text-xs font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.buyerTaxId}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Invoice number & date</span>
                  <span className="text-slate-900 dark:text-slate-50">
                    <span className="font-mono font-medium">{selectedScenario.invoice.invoiceNumber}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span>{selectedScenario.invoice.invoiceDate}</span>
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Material category</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.materialCategory}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Total invoice value</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {selectedScenario.invoice.totalValue}
                  </span>
                </div>
                <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-500">Government reference number</span>
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {selectedScenario.invoice.referenceNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3: Contract Check List */}
          {revealStage >= 3 && (
            <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-800/40 dark:bg-slate-950 transition-opacity duration-300">
              <div className="mb-3 border-b border-black/5 pb-2 dark:border-white/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Stage 3: Contract commitment checks
                </p>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {selectedScenario.checks.map((check, index) => (
                  <div
                    key={index}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-900 dark:text-slate-50">{check.label}</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span>Expected: {check.expected}</span>
                        <ArrowRight size={12} className="text-slate-300" />
                        <span>Found: {check.found}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {check.result === "pass" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <Check size={12} strokeWidth={2.5} />
                          Match
                        </span>
                      )}
                      {check.result === "warning" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Notice
                        </span>
                      )}
                      {check.result === "fail" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Mismatch
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 4: Single Coloured Verdict Banner */}
          {revealStage >= 4 && (
            <div
              className={`rounded-xl border p-6 sm:p-7 transition-all duration-300 ${
                verdictStyles[selectedScenario.verdict].bg
              } ${verdictStyles[selectedScenario.verdict].border}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                      verdictStyles[selectedScenario.verdict].pill
                    }`}
                  >
                    Verdict: {selectedScenario.verdict.replace("-", " ")}
                  </span>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Decision countdown:{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedScenario.timeRemaining}
                    </span>
                  </div>
                </div>

                <div>
                  <h2
                    className={`text-base sm:text-lg font-semibold ${
                      verdictStyles[selectedScenario.verdict].text
                    }`}
                  >
                    {selectedScenario.verdictHeadline}
                  </h2>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed ${
                      verdictStyles[selectedScenario.verdict].subtext
                    }`}
                  >
                    {selectedScenario.verdictExplanation}
                  </p>
                </div>

                {selectedScenario.amountAtRisk > 0 && (
                  <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800/40 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Amount at risk</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Rs {selectedScenario.amountAtRisk.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {/* Contextual navigation to linked deviation or commitment */}
                {(selectedScenario.linkedIssueId || selectedScenario.linkedCommitmentId) && (
                  <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800/40 flex flex-wrap items-center gap-4 text-xs">
                    {selectedScenario.linkedIssueId && (
                      <Link
                        href={`/inspector/project/${projectId}/deviations/${selectedScenario.linkedIssueId}`}
                        className="inline-flex items-center gap-1 font-medium text-slate-900 dark:text-white underline hover:opacity-80"
                      >
                        Open case file in inspection queue ({selectedScenario.linkedIssueId})
                        <ExternalLink size={12} />
                      </Link>
                    )}
                    {selectedScenario.linkedCommitmentId && (
                      <Link
                        href={`/stakeholder/project/${projectId}/commitments`}
                        className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 underline hover:opacity-80"
                      >
                        Review contract commitment ({selectedScenario.linkedCommitmentId})
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
