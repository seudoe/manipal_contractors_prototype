# update.md — ANUBANDH UI tasks (frontend prototype only)

**How to use this file:** give your IDE agent `TASK 0` first and wait for its
report. Then give the remaining tasks **one at a time, in order**, verifying
each before moving on. Do not paste several together — some touch the same
files and will conflict.

---

## GLOBAL RULES — repeat these with every task

```
GLOBAL RULES FOR THIS ENTIRE SESSION. These override anything else you
infer, and apply to every task I give you.

1. DO NOT run `git commit`. DO NOT run `git push`. DO NOT run `git add`,
   create branches, tags, or stashes. Leave the working tree dirty — I will
   review and commit manually. If you think a commit is needed, stop and
   tell me.

2. THIS IS A UI-ONLY PROTOTYPE. There is NO working logic of any kind.
   Do NOT write engines, calculators, validators, scoring functions,
   detection algorithms, cryptography, hashing, or verification code.
   Every number, score, level, verdict, timestamp, percentage and status
   shown on screen is a HARDCODED VALUE hand-authored in a `db/*.ts` file.
   The screens read that data and render it. That is all.

   Concretely:
   - Do not compute a severity level — read a `level` field off the record.
   - Do not compute a priority — read a `priority` field.
   - Do not compute a countdown — read a `timeRemaining: "3h 49m"` string.
   - Do not verify a signature — read a pre-authored verification result.
   - Do not compute earned value or a claim gap — read the numbers.
   If you find yourself writing an `if` chain that derives a verdict,
   stop: that verdict should be a field in the seed data instead.

3. NO BACKEND, NO PACKAGES FOR LOGIC. No database, ORM, migration tool,
   server, queue, or network call. No new dependencies except UI ones if a
   task explicitly names them. No environment variables. Everything is an
   in-memory array under `db/`, in the same style as the existing files.

4. FORMS AND BUTTONS ARE INERT unless a task says otherwise. A submit
   button may show a success state, but it must not mutate anything. Add a
   short code comment wherever something is deliberately inert so nobody
   later mistakes it for a bug.

5. ADDITIVE ONLY. Do not change, rename, refactor, reformat or delete
   anything that already works. Do not alter the behaviour of any existing
   page, existing `db/queries.ts` function, existing type field, or
   existing component. You may ADD optional fields, new functions, new
   files and new routes. If a task appears to require changing existing
   behaviour, stop and ask me.

6. READ `CONTEXT.md` BEFORE EVERY TASK and obey its warnings:
   - Route params are intentionally inconsistent: `[projectId]` for
     contractor and stakeholder, `[project_id]` for inspector. Match the
     tree you are editing. Do NOT normalise them.
   - Edge convention: `source -> target` means "target depends on source".
   - The feature graph uses `rankdir: "BT"` with top handle = source,
     bottom = target. The contractor graph uses `"TB"` with the opposite.
     Never copy handle types between node components.
   - `types/*.ts` has `NOTE:` comments where the spec contradicts itself.
     Leave them. Do not "fix" them.
   - If you change any demo account email in `db/users.ts`, update the hint
     text in `components/auth-form.tsx` in the same edit.

7. DO NOT build `db/evidence.ts`, `db/reports.ts`, or `db/notifications.ts`
   as originally specced. Leave the `coming-soon.tsx` placeholders alone
   unless a task explicitly replaces one.

8. After each task: run `npm run build`, confirm it passes with no new type
   errors, report a file-by-file list of what you changed, then STOP and
   wait. Do not start the next task on your own.
```

---

## TASK 0 — Analysis only, write no code

```
Analyse this project and report back. Write NO code and create NO files.

1. Read `CONTEXT.md` in full. Then read `project_coding_spec.md` and
   `IMPORTANT.md` in the project root IN FULL — CONTEXT.md warns the spec
   past line 296 was never reconciled with the code, so read all of it and
   tell me what is in those sections.

2. Map the codebase: every file under `app/`, `components/`, `db/`, `lib/`,
   `types/`, one line each on what it does.

3. Inventory `db/queries.ts`: every exported function, its signature, and
   which pages call it.

4. Give me the current shape of every interface in `types/`, noting which
   fields are optional and where the `NOTE:` comments sit.

5. Tell me which existing components I can reuse for new screens — any
   card, badge, table, list, empty-state, panel or layout primitive that
   already exists. I want to match the existing visual language, not invent
   a second one. Name the files.

6. Tell me how the existing pages get their data: server component calling
   `db/queries.ts` directly, or client component with props? I need new
   pages to follow the same pattern.

7. List every place where adding an OPTIONAL field to an existing type
   would still cause a type error elsewhere.

8. Confirm you understand: UI only, no logic, all values hardcoded in
   `db/`, no commits, no pushes.

Output as a chat report. Do not create a file for it.
```

---

## TASK 1 — Types and all static data, in one pass

```
Add the type definitions and ALL the hardcoded data the new screens will
render. No UI in this task. Remember: every displayed value is authored by
hand here, not computed later.

TYPES — add optional fields only, and create new files:

1. In `types/graph.ts`, add to `GraphNode` (all optional):
   `criticality?: "COSMETIC" | "FINANCIAL" | "IDENTITY" | "STRUCTURAL" | "SAFETY"`
   `toleranceBand?: "NONE" | "TIGHT" | "LOOSE" | "COSMETIC"`
   `irreversibleEvent?: string`
   `irreversibleLabel?: string`   // display string e.g. "Pour at 12:00 today"
   `valueAtRisk?: number`

2. Create `types/commitment.ts`:
   - `Commitment` — id, projectId, nodeId, label (plain-language, for
     display), subject, predicate, promisedValue, sourceLabel, sourceRef,
     actorContractorId, criticality, toleranceBand, expectedEvidence:
     string[]
   - `CommitmentCredential` — id, commitmentId, partyName, role,
     status: "ACTIVE" | "REVOKED", issuedAt

3. Create `types/observation.ts`:
   - `Observation` — id, projectId, sourceType (union: "GST_IRN_QR" |
     "EWAY_BILL" | "WEIGHBRIDGE" | "GATE_CREDENTIAL" | "ATTENDANCE" |
     "EQUIPMENT_GPS" | "SITE_PHOTO" | "BANK_PAYMENT" | "GIT_COMMIT" |
     "SBOM" | "LAB_CERTIFICATE"), sourceLabel, trustLabel (a display
     string like "Government-signed, cannot be authored by the contractor"),
     trustScore (number 0-1, for display only), observedValue, observedAt,
     hash (a hardcoded-looking hex string)
   - `Expectation` — id, commitmentId, expectedType, expectedLabel,
     dueLabel (display string), overdueLabel (e.g. "6 days overdue" or
     null), status: "PENDING" | "MET" | "MISSING"

4. Create `types/deviation.ts`:
   - `DeviationLevel = "L0" | "L1" | "L2" | "L3" | "L4"`
   - `Deviation` — id, projectId, commitmentId, observationId | null,
     expectationId | null, kind: "MISMATCH" | "SILENCE" | "PROMOTED",
     level, title, promisedText, observedText, reasons: string[],
     valueAtRisk, priority (hardcoded number), timeRemaining (display
     string e.g. "3h 49m" or "passed"), priorityFactors (array of
     { label, value } pairs, purely for display in the breakdown panel),
     contributingDeviationIds: string[], cumulativeValue: number | null,
     status: "OPEN" | "EVIDENCE_REQUESTED" | "CLOSED", raisedAt
   - `GateEvent` — id, projectId, nodeId, checkpointLabel, decision:
     "PASS" | "PASS_WITH_EVIDENCE" | "HOLD", level, reasons: string[],
     valueAtRisk, timeRemaining, at, overrideId: string | null
   - `Override` — id, gateEventId, officerName, reason, at, hash, prevHash

5. Create `types/verification.ts`:
   - `ScanScenario` — id, label (e.g. "Approved quarry - clean"),
     description, signatureValid: boolean, signatureNote (display string),
     payload: { sellerGstin, sellerName, buyerGstin, docNo, docDate,
     totalValue, itemCount, mainHsn, irn }, checks: array of
     { label, expected, found, pass }, resultGateEventId
   Add a comment: each scenario is a pre-authored playback of what a scan
   would produce. No actual verification happens.

6. Export everything from `types/index.ts`.

DATA — hand-author all of it:

7. Backfill the new optional fields on existing nodes in `db/nodes.ts`
   without changing any existing value. Include at least one COSMETIC /
   toleranceBand COSMETIC node (the paint case) and at least one
   STRUCTURAL / toleranceBand NONE node with
   `irreversibleEvent: "CONCRETE_POUR"` and
   `irreversibleLabel: "Pour at 12:00 today"`.

8. Create `db/commitments.ts` — 12 to 15 commitments for project-1, tied to
   real existing nodeIds. Must include: Fe500 steel grade (STRUCTURAL /
   NONE), sand source "Quarry Q-114" with a fake GSTIN (STRUCTURAL / NONE),
   a subcontractor identity commitment pointing at ElectroWorks (IDENTITY),
   and an exterior paint colour (COSMETIC / COSMETIC).

9. Create `db/credentials.ts` — one credential per named party, with one
   marked REVOKED so a credential failure is demoable.

10. Create `db/observations.ts` — around 25 observations for project-1.
    Author `trustLabel` and `trustScore` per source: GST_IRN_QR and
    BANK_PAYMENT high ("Government-signed"), WEIGHBRIDGE and EQUIPMENT_GPS
    medium ("Device-generated"), SITE_PHOTO low ("Submitted by contractor
    - corroboration only").

11. Create `db/expectations.ts` — mostly MET, plus at least two MISSING with
    an `overdueLabel`, one of which must be a LAB_CERTIFICATE.

12. Create `db/deviations.ts` — hand-author around 12 deviations for
    project-1 with levels, priorities and timeRemaining strings already
    filled in. The set must include, so every screen has something to show:
    - an L0 and an L1 cosmetic case (paint), low priority
    - an L3 material-source mismatch (wrong quarry GSTIN), high priority,
      timeRemaining "3h 49m"
    - an L4 identity case (unapproved subcontractor on site)
    - a `kind: "SILENCE"` L3 case with `observationId: null`, referencing
      the missing LAB_CERTIFICATE expectation
    - a `kind: "PROMOTED"` L2 case titled "Systematic finish downgrade (14
      items, Rs 18.2L)" with `contributingDeviationIds` listing 14 real
      L0/L1 ids you also author, and a `cumulativeValue`
    Fill `priorityFactors` on the L3 case so the breakdown panel reads like:
    criticality STRUCTURAL x4.0, magnitude 1.0, value at risk Rs 1.42 Cr,
    recurrence x1.2, divided by 3.8 hours remaining = 91.4.

13. Create `db/gate-events.ts` — 4 or 5 events across PASS,
    PASS_WITH_EVIDENCE and HOLD, one of them already overridden.

14. Create `db/overrides.ts` — 2 seeded overrides with hardcoded
    hash/prevHash hex strings.

15. Create `db/financial.ts` — for project-1, hardcode: claimedPercent 38,
    observedPercent 19, claimGap 19, two arrays of `{ month, value }`
    points for the claimed and observed curves, a CPI figure, a
    cost-to-complete figure, and a `tripleEntry` array of periods each
    already labelled with its pattern and a plain-language interpretation
    string. Include one period flagged as material-plus-money-without-work.

16. Create `db/scan-scenarios.ts` — three `ScanScenario` records:
    approved quarry (clean, all checks pass), wrong supplier GSTIN (the
    fraud case, leading to the HOLD gate event), and a mismatched recipient
    GSTIN (diversion case).

17. Add read-only functions to `db/queries.ts` for all of the above,
    following the comment convention at the top of that file. Do not modify
    any existing function. Include at minimum: getCommitmentsForProject,
    getCredentialsForProject, getObservationsForProject,
    getExpectationsForProject, getMissingExpectations,
    getDeviationsForProject, getDeviationQueue (all projects, already
    sorted by the hardcoded priority), getDeviationById,
    getGateEventsForProject, getGateEventById, getOverrideById,
    getFinancialForProject, getScanScenarios.

    These are plain array lookups and filters. No computation.

Run `npm run build`.
```

---

## TASK 2 — Shared UI primitives

```
Build the small reusable pieces before any page, so the new screens look
consistent and match the existing app. Reuse the existing components you
identified in TASK 0 rather than inventing new styling where possible.

Create under `components/anubandh/`:

1. `level-badge.tsx` — renders L0 to L4. L0 and L1 must read as calm and
   informational, L2 as a caution, L3 and L4 as unmistakably urgent.
   Include the level name (Cosmetic / Minor / Material / Critical /
   Integrity) alongside the code.

2. `decision-card.tsx` — the big gate verdict card. Three states: PASS
   (green), PASS_WITH_EVIDENCE labelled "Proof needed" (amber), HOLD (red).
   Takes a level, a reasons array, valueAtRisk, and a timeRemaining string.
   Make HOLD large and impossible to miss — this is the screen we demo.

3. `trust-note.tsx` — takes an Observation's sourceType, trustLabel and
   trustScore and renders a short badge plus one line of plain-language
   explanation of how independent the source is.

4. `priority-panel.tsx` — renders a `priorityFactors` array as a readable
   breakdown ending in the final priority number, so it looks derived
   rather than magic. It is purely presentational; it must not calculate
   anything.

5. `time-remaining.tsx` — displays a timeRemaining string with an urgency
   colour ramp based on the string only (e.g. anything in minutes or under
   4 hours reads urgent, "passed" reads muted). No date math.

6. `promised-vs-observed.tsx` — a two-column comparison block. Must have a
   distinct variant for a SILENCE deviation, where the observed column
   reads "Expected evidence never arrived" instead of showing a value.

7. `empty-state.tsx` — only if the existing codebase has no equivalent.

Do not create any pages in this task. Run `npm run build` and show me these
rendered on a temporary scratch page if that is easier, then remove the
scratch page.
```

---

## TASK 3 — Gate scan screen (contractor tree)

```
Build the field-supervisor scan screen. This is the screen we demo first,
so it needs to feel decisive.

1. Create `app/contractor/project/[projectId]/gate-scan/page.tsx` plus
   `components/anubandh/gate-scan-view.tsx` (client component).

2. It reads `db/scan-scenarios.ts`. Render the three scenarios as large
   labelled buttons — "Approved quarry", "Wrong supplier", "Diverted
   consignment". Clicking one plays back that scenario's pre-authored
   result. There is no scanning and no verification: the record already
   contains the outcome.

3. On selection, reveal the result in three visible stages, with a short
   delay between them so it reads as a process rather than an instant dump:
   - signature check: show `signatureValid` and `signatureNote`
   - the decoded payload fields as a labelled grid (seller GSTIN and name,
     buyer GSTIN, doc number, date, total value, item count, HSN, IRN)
   - the `checks` array as a pass/fail list of expected vs found
   Then render `decision-card.tsx` with the linked gate event.

4. Add a prominent static indicator: "Offline verification - no network
   required". Add a code comment noting this is a display claim about the
   real mechanism, not something this prototype implements.

5. Include a disabled-looking "Scan with camera" button with a tooltip or
   caption saying it is not wired in this prototype. Do NOT add a camera
   library.

6. Add `gate-scan` to `components/project-sidebar.tsx` for the CONTRACTOR
   role only. Do not touch any existing sidebar entry.

Run `npm run build`. Do not touch the inspector or stakeholder trees.
```

---

## TASK 4 — Inspector deviation queue and case file

```
Build the officer screens. The inspector tree uses `[project_id]`
(snake_case) — match it, do not normalise.

1. `app/inspector/deviations/page.tsx` — cross-project queue from
   `getDeviationQueue()`. Each row: level badge, the deviation title,
   project name, value at risk, priority number, and the timeRemaining
   chip. Rows come pre-sorted from the data; do not sort in the component.
   Add filter controls for level and project (these may filter the array
   client-side — that is display filtering, which is allowed).
   Add a toggle "Hide cosmetic (L0/L1)", defaulting to ON, with a one-line
   caption explaining that most deviations are innocent and an
   undifferentiated list is what makes officers stop looking.

2. `app/inspector/project/[project_id]/deviations/page.tsx` — same queue,
   scoped to one project.

3. `app/inspector/project/[project_id]/deviations/[deviationId]/page.tsx` —
   the case file. Sections:
   - header: level badge, title, status, value at risk, timeRemaining
   - `promised-vs-observed.tsx`, using the SILENCE variant where
     `kind === "SILENCE"`
   - `trust-note.tsx` for the linked observation, or for a silence case a
     panel naming what should have arrived, from whom, and how overdue
   - `priority-panel.tsx` with the priorityFactors
   - the reasons list
   - for a PROMOTED deviation: a table of the contributing small deviations
     with the cumulative value, and a caption explaining that individually
     harmless changes are being read together
   - an inert "Request evidence" button that shows a success toast and
     changes nothing. Comment it as deliberately inert.

4. `app/inspector/gate-log/page.tsx` — every gate event with decision,
   reasons, and the overriding officer's name inline where present.

5. Add these to the inspector sidebars only.

Run `npm run build`.
```

---

## TASK 5 — Override screen

```
Build the named-accountability screen. Nothing is written anywhere.

1. `app/inspector/project/[project_id]/gate/[gateEventId]/override/page.tsx`

2. Show the gate event being overridden, then a reason textarea, then a
   clearly worded warning panel: the override will be permanently recorded
   against the officer by name and cannot be removed. Pull the officer's
   name from `lib/session.ts` so it displays the actually-logged-in
   inspector.

3. The submit button shows a confirmation state displaying a pre-authored
   chain entry (officer name, timestamp, reason, and a hardcoded-looking
   hash). It must not mutate `db/overrides.ts`. Comment it as inert.

4. `app/inspector/override-audit/page.tsx` — a table of override counts per
   officer from the seeded data, with a caption explaining why this screen
   exists: if you only monitor contractors, the override becomes the new
   fraud channel.

5. Add a static "chain intact" indicator on the gate log and override pages.
   It is a display element; do not verify anything.

Run `npm run build`.
```

---

## TASK 6 — Financial screens

```
Render the money views from the hardcoded `db/financial.ts`. Compute
nothing — every figure is already in the data.

1. `app/inspector/project/[project_id]/financial/page.tsx`:
   - headline: the claim gap as a large number ("19 points"), with the
     claimed 38% and observed 19% beneath it
   - both curves drawn together in a single inline SVG line chart from the
     two hardcoded point arrays, so the divergence is the visual. Do NOT
     add a charting library — hand-write the SVG path from the points.
   - the triple-entry table: one row per period with money / material /
     work tick-or-cross columns, the pattern name, and the plain-language
     interpretation string. Highlight the flagged row.
   - a small panel with the CPI and cost-to-complete figures
   - one caption line explaining these figures come from observed inputs
     rather than a filed progress claim

2. Mirror a read-only version at
   `app/stakeholder/project/[projectId]/financial/page.tsx` — note the
   camelCase param in this tree.

3. Sidebar entries for inspector and stakeholder only. Contractors do not
   get this view.

Run `npm run build`.
```

---

## TASK 7 — Expectations / silence screen

```
Surface the missing-evidence cases, from `db/expectations.ts`.

1. `app/inspector/project/[project_id]/expectations/page.tsx` with three
   groups in this order: MISSING, PENDING, MET. Lead with MISSING and make
   it visually dominant. Each missing row shows what should have arrived,
   from whom, its dueLabel, and its overdueLabel.

2. Add an "Implied evidence" panel with hardcoded figures: concrete
   delivered per the delivery records, the number of cube tests that should
   therefore exist, the number of lab certificates actually on file, and
   the shortfall. Add one caption line explaining that delivery records
   tell you how many tests must exist, so a shortfall shows up with nobody
   reporting it.

3. On the case-file page from TASK 4, link any SILENCE deviation through to
   its expectation.

4. Sidebar entry for inspector only.

Run `npm run build`.
```

---

## TASK 8 — Collusion graph (READ THE WARNING FIRST)

```
Build the third graph type. This is the one task with real frontend
complexity, so read CONTEXT.md section 6 before starting.

WARNING: `@xyflow/react` node components have handle types baked in, and the
two existing node components have OPPOSITE handle orientations because one
graph is `rankdir: "BT"` and the other is `"TB"`. Do NOT copy
`feature-node.tsx` or `contractor-node.tsx`. Decide the layout first, then
set handle types to match it.

This graph is relational, not hierarchical — firms cluster rather than rank
— so TB/BT is the wrong tool. Use a simple radial or hand-positioned
layout, or dagre with `rankdir: "LR"`. Put any new layout helper in
`lib/graph/layout.ts` as a NEW exported function. Do not modify
`layoutWithDagre`.

1. Add these OPTIONAL fields to `db/contractors.ts` without changing
   existing values: gstin, pan, registeredAddress, incorporationDate,
   directors (string[]), bankIfsc. Author them so that ElectroWorks and a
   new fourth entity share a director and a registered address, and that
   new entity was incorporated shortly before project-1's tender date.

2. Create `db/collusion.ts` with a hand-authored `findings` array. Each
   finding: id, motifType ("SHARED_DIRECTOR" | "SHARED_ADDRESS" |
   "SHARED_BANK" | "RECENT_INCORPORATION" | "LOSING_BIDDER_AS_SUB"),
   severity, the two or more entity ids involved, and a plain-language
   `explanation` string saying why it is suspicious. Include one
   LOSING_BIDDER_AS_SUB finding — it is the strongest signal and the demo
   needs it. Also hand-author the `nodes` and `edges` arrays for the graph
   directly in this file; do not derive them.

3. Create `components/graph/entity-node.tsx` (new renderer — firm name,
   GSTIN, incorporation date) and
   `components/graph/collusion-graph-flow.tsx`. Edges are labelled and
   colour-coded by motifType. Set `nodesConnectable={false}` to match the
   existing graphs. Nodes draggable.

4. `app/inspector/collusion/page.tsx` — the graph, with the findings list
   beneath it. Clicking a finding highlights its edge.

Run `npm run build`. Confirm in chat that edges render cleanly between
handles and do NOT loop around the sides of the node boxes — if they loop,
your handle types are backwards.
```

---

## TASK 9 — Cross-domain proof: a software contract

```
Add a fourth project that is a SOFTWARE contract, so the same screens can
be shown for both domains. This matters most for the pitch — do not stub it
shallowly.

1. Add `project-4` "State Citizen Services Portal" to `db/projects.ts`,
   assigned to an existing contractor, with stakeholders added to
   `db/project-stakeholders.ts` following the existing rotation pattern.

2. Add its nodes and edges to `db/nodes.ts` / `db/edges.ts` — a software
   feature DAG (auth module, payments, citizen records, deploy pipeline).
   Same edge convention, and include the synthetic "feature -> project
   root" edges the existing projects use. Set
   `irreversibleEvent: "PRODUCTION_DEPLOY"` and an `irreversibleLabel` on
   the deploy node.

3. Add commitments: six named key personnel (IDENTITY), a data-residency
   commitment (promisedValue "India", STRUCTURAL / NONE), and an approved
   package list with LOOSE tolerance.

4. Add observations and deviations for it, hand-authored:
   - an L0 patch-version bump (4.2.1 to 4.2.3), calm and silent
   - an L3 data-residency deviation: SBOM shows a new subprocessor outside
     India, with an accompanying HOLD gate event on the deploy node
   - an L4 personnel case: 71% of recent commits from a contributor with no
     credential, four of six named seniors at zero commits
   Add a matching credential record and a REVOKED or missing one for the
   uncredentialed contributor.

5. Add a second scan-scenario set in `db/scan-scenarios.ts` for the deploy
   checkpoint: an SBOM payload instead of an invoice payload, resolving to
   the HOLD gate event. Wire it into the gate-scan page as a second
   scenario group labelled "Production deploy".

6. Walk every screen built so far with project-4 selected — deviation
   queue, case file, gate log, expectations, gate scan — and confirm each
   renders correctly with NO domain-specific conditional in any component.
   If any component needs a domain `if`, tell me where and why BEFORE
   adding it: the whole point is that the screens are domain-neutral.

Run `npm run build`.
```

---

## TASK 10 — Commitment review and public view

```
The last two surfaces.

1. `app/stakeholder/project/[projectId]/commitments/page.tsx` — the
   award-time review screen. Table of every commitment with its
   criticality and toleranceBand rendered as select inputs that look
   editable but change nothing. Comment them as inert. Add a header line
   explaining this is the only point where a human configures the system,
   and it takes about ten minutes per contract.

2. `app/public/[projectId]/page.tsx` — an unauthenticated citizen view.
   Place it OUTSIDE the three role trees so no layout role check applies.
   Show: project name, authority, committed-versus-verified counts, the
   number of open L3/L4 cases WITHOUT naming any party or exposing
   evidence, and a last-verified date. Add an inert "report a concern" form
   with a visible note that citizen reports can open a case but never close
   one.

3. On the inspector project page, add a block representing the site notice
   board: a static QR-looking placeholder image or CSS block plus the
   public view link.

Run `npm run build`.
```

---

## TASK 11 — Demo hardening, no new features

```
No new features. Make the build demo-proof.

1. Walk the entire app as all three roles across all four projects. Report
   every page that errors, renders empty, or shows a raw id where a
   human-readable name belongs.

2. Confirm every number, level and verdict on every new screen traces back
   to a hardcoded field in a `db/*.ts` file. If you find anything being
   computed in a component or a lib function, tell me where — that is a
   violation of the brief and I want to know about it.

3. Confirm `npm run build` passes clean with no new type errors.

4. Review your own `git diff`. List every file touched across all tasks and
   confirm each change was purely additive. Flag anything that was not.

5. Confirm you have made NO commits and NO pushes and the working tree is
   dirty and ready for my review.

6. Give me a one-page summary of everything added, grouped by feature, with
   the exact route to visit to see each one — I will use this as the demo
   running order.
```

---

## Screen coverage map

| Screen | Route | Task |
|---|---|---|
| Gate scan (construction + deploy) | `/contractor/project/[projectId]/gate-scan` | 3, 9 |
| Deviation queue (all projects) | `/inspector/deviations` | 4 |
| Deviation queue (per project) | `/inspector/project/[project_id]/deviations` | 4 |
| Case file | `.../deviations/[deviationId]` | 4 |
| Gate log | `/inspector/gate-log` | 4 |
| Override | `.../gate/[gateEventId]/override` | 5 |
| Override audit | `/inspector/override-audit` | 5 |
| Financial / claim gap | `.../financial` | 6 |
| Expectations / silence | `.../expectations` | 7 |
| Collusion graph | `/inspector/collusion` | 8 |
| Commitment review | `/stakeholder/project/[projectId]/commitments` | 10 |
| Public citizen view | `/public/[projectId]` | 10 |

---

## Demo running order

1. Commitment review — "the only human configuration step"
2. Gate scan, approved quarry — clean PASS
3. Gate scan, wrong supplier — HOLD, 3h 49m remaining
4. Inspector queue — the HOLD at the top, cosmetic cases hidden by default
5. Case file — promised vs observed, trust note, priority breakdown
6. Expectations — the missing lab certificate
7. Financial — the 19-point claim gap and the diverging curves
8. Collusion graph — losing bidder as subcontractor
9. Switch to project-4, same screens — the software contract
10. Override — named accountability, then the audit page

---

## If the agent goes off the rails

```
Stop. Revert anything you changed outside the files I asked for in the
current task. Do not commit or push. Show me `git status` and
`git diff --stat`, then wait.
```
