# CONTEXT.md — how this project got here and how it works

This file exists so anyone (human or agent) picking up this repo cold can
get oriented fast. It's a summary of a full build session — what was built,
why it's structured the way it is, and the traps we already hit so you
don't step in them again.

Read `project_coding_spec.md` (project root, one level up from `manipal/`)
and `IMPORTANT.md` (same place) first — they're the actual product spec.
This file explains what was *implemented* against that spec, and where the
implementation deliberately deviates or fills a gap the spec left open.

**Important:** `project_coding_spec.md` was only read up to line 296 by the
person who wrote the original prompt for this session, and lines beyond
that were only read later, mid-session. If you (or your agent) touch
anything past what's described here, re-read the spec file in full first —
there may be sections neither of us has fully reconciled with the code yet.

---

## 1. Tech stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** for styling
- **lucide-react** for icons
- **@xyflow/react** (React Flow) + **@dagrejs/dagre** for the project/contractor graph visualizations
- No real database yet — everything lives in in-memory arrays under `db/`
  (see §4). No real auth provider — plaintext demo passwords in `db/users.ts`.

Run it:
```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build / typecheck
```

---

## 2. Route structure (`app/`)

Three role-scoped route trees, each with its own top-level layout that
gates access by `globalRole` and renders the global sidebar:

```
app/
├── page.tsx                 # landing page — login/register form directly on it
├── login/page.tsx           # same form, separate route
├── actions.ts                # server actions: login, register, quickLogin, logout
│
├── contractor/
│   ├── layout.tsx            # redirects to "/" if not logged in as CONTRACTOR
│   ├── profile/, settings/, projects/, notifications/   (top-level, "coming soon" except projects)
│   └── project/[projectId]/
│       ├── layout.tsx        # project sidebar + header, access-checks the project
│       ├── page.tsx          # overview
│       ├── dashboard/        # real data — spec §47 cards
│       ├── project-graph/    # real data — React Flow graph
│       ├── stakeholder-details/  # real data — list of this project's stakeholders
│       ├── subcontractors/   # real data — contractor's own subcontractors on this project
│       ├── changes/          # real data — change/version history
│       ├── daily-reports/, notifications/, settings/     ("coming soon" — no data model yet)
│
├── stakeholder/               # mirrors contractor/, but:
│   └── project/[projectId]/
│       ├── contractor-details/   # real data — contractor hierarchy AS A GRAPH (not subcontractors/)
│       └── (no subcontractors/ tab — spec says stakeholders don't get it)
│
└── inspector/
    ├── layout.tsx             # redirects to "/" if not logged in as INSPECTOR
    ├── profile/, settings/, projects/, notifications/
    └── project/[project_id]/  # NOTE: snake_case param here, camelCase elsewhere —
        ├── layout.tsx          # this mismatch is intentional/preserved from how the
        ├── page.tsx            # route structure was originally specified; the two
        ├── changes/            # dynamic segments are NOT interchangeable, don't "fix"
        └── graph/               # this without checking both layout.tsx files use it consistently
```

The global sidebar (`components/role-shell.tsx`) shows Projects / Profile /
Settings / Notifications and collapses to icon-only once you're inside a
project. The project-specific sidebar (`components/project-sidebar.tsx`) is
owned by each `project/[id]/layout.tsx`.

---

## 3. Auth (prototype-only, no real provider)

`db/users.ts` is the **single source of truth** for users — it's both the
domain dataset (see §5) and the login table. There used to be a separate
`lib/auth.ts` with its own 3 login-only accounts; that file was deleted and
merged into `db/users.ts` so contractor/stakeholder logins resolve to real
linked data (their contractor org, their projects, etc.) instead of a
disconnected identity.

- `types/user.ts`'s `User` interface has a `password: string` field that is
  **prototype-only** and not part of the real spec schema — there's no real
  auth provider. It's plaintext.
- `lib/session.ts` — sets/reads a `session_user_id` cookie (httpOnly), looks
  the user up via `db/queries.ts#getUserById`.
- `app/actions.ts` — `login` (email+password against `db/users.ts`),
  `register` (creates a new user via `db/queries.ts#createUser`, mutating
  the in-memory array — **not persisted across a server restart**),
  `quickLogin(role)` (logs in as the first user of that role, used by the
  three demo buttons on the login form), `logout`.
- All 9 demo accounts share the password **`password`**.

Demo accounts (also see `components/auth-form.tsx`'s hint text, which must
be kept in sync with `db/users.ts` if emails ever change — this went stale
once already this session and broke the login hint):

| Email | Role | Linked to |
|---|---|---|
| ananya.rao@stakeholders.gov | STAKEHOLDER | OWNER of project-1, EDITOR of project-3 |
| rajesh.menon@stakeholders.gov | STAKEHOLDER | EDITOR of project-1, OWNER of project-2 |
| priya.nair@stakeholders.gov | STAKEHOLDER | EDITOR of project-2, OWNER of project-3 |
| vikram.shah@buildcorp.com | CONTRACTOR | BuildCorp (main contractor) |
| suresh.kumar@electroworks.com | CONTRACTOR | ElectroWorks (subcontractor under BuildCorp) |
| neha.kapoor@skyrise.com | CONTRACTOR | SkyRise Builders (main contractor) |
| arjun.verma@aquabuild.com | CONTRACTOR | AquaBuild (subcontractor under SkyRise) |
| meera.iyer@qualityinspect.gov | INSPECTOR | — |
| karan.bhatt@qualityinspect.gov | INSPECTOR | — |

Registering a new account creates a user with **no linked project/contractor
data** — they'll just see an empty projects list. That's expected, not a bug.

---

## 4. Domain types (`types/`)

Transcribed from `project_coding_spec.md` §4–§26 (the "Core TypeScript
Interfaces" section plus the DB table definitions each section describes).
One file per entity group, plus `types/index.ts` as a barrel export:

- `user.ts` — `User`, `GlobalRole`
- `project.ts` — `Project`, `ProjectStakeholder`
- `contractor.ts` — `Contractor`, `ProjectContractor`, `FeatureAssignment`
- `graph.ts` — `GraphNode`, `GraphEdge` (the feature DAG — see §6)
- `change.ts` — `ProjectVersion`, `ProjectChange`, `ChangeReview`, `ChangeRiskScore`
- `evidence.ts` — `Evidence` (type only — no `db/evidence.ts` was created, see §5)
- `report.ts` — `DailyReport`, `DailyReportFeature`, `DailyReportEvidence`, `StatusRequest` (types only, no `db/` backing yet)
- `notification.ts` — `Notification` (type only, no `db/` backing yet)
- `audit.ts` — `AuditLog` (type only, no `db/` backing yet)

**The spec itself has internal inconsistencies** between its DB table
column lists and its "Core TypeScript Interfaces" section (different
field sets, snake_case vs camelCase, etc.). Rather than silently picking a
winner, each file has a `NOTE:` comment at the spec's specific
disagreement — e.g. `GraphNode.type` vs. the earlier section's
`ProjectNode.nodeType` (same field, two names in the spec), or `User`
missing `created_at`/`updated_at` in the interface section but having them
in the table section. **Read those NOTEs before "fixing" a type** — the
current shape was a deliberate choice to keep both possibilities visible,
not an oversight.

---

## 5. Demo dataset (`db/`)

This is a **hand-authored, hardcoded, in-memory dataset** — not a real
database. Every file exports a plain array; `db/queries.ts` is the only
module anything else should import from (see the big comment at its top).
Treat `db/queries.ts`'s exported functions as the seam where a real
Supabase/Prisma backend would eventually slot in — pages call
`getProjectsForUser(userId)`, not `projects.filter(...)` directly.

**What exists:**
- `users.ts` — 9 users: 3 stakeholders, 4 contractor-org owners, 2 inspectors (§3)
- `contractors.ts` — 4 contractors: **BuildCorp** (main) → **ElectroWorks**
  (its subcontractor); **SkyRise Builders** (main) → **AquaBuild** (its
  subcontractor). Flat table with `parentContractorId`, per spec §7 — no
  nested JSON, even though `IMPORTANT.md` sketches a nested-JSON shape for
  contractor hierarchies. We went with the flat-table + query-function
  approach instead since the spec explicitly asks for a flat table (§7) and
  it composes better with the rest of the query layer. If you want the
  nested-JSON shape `IMPORTANT.md` describes, `db/queries.ts#getProjectContractorTree`
  already computes an equivalent tree on demand — you'd just be changing
  the *shape* returned, not the underlying data model.
- `projects.ts` — 3 projects:
  - **project-1** "Riverside Metro Extension" (BuildCorp, has change history: v0→v1→v2, one change still `PENDING`)
  - **project-2** "Greenfield Hospital Complex" (SkyRise Builders, has change history: v0→v1, all changes `APPROVED`)
  - **project-3** "Smart Water Distribution Network" (BuildCorp again, brand new — only a v0 baseline, zero changes)
- `project-stakeholders.ts` — each project has exactly 2 stakeholders (one
  OWNER, one EDITOR), rotated across the 3 stakeholders so everyone sits on
  two projects.
- `project-contractors.ts` — main + subcontractor link per project.
- `nodes.ts` / `edges.ts` — the feature DAG per project (see §6 for how this
  renders). Every project's graph includes synthetic "feature → project
  root" edges we added specifically so the root node isn't floating
  disconnected in the graph view — see the comment at the top of `edges.ts`.
- `feature-assignments.ts` — which contractor is responsible for
  (`RESPONSIBLE`) or has been subcontracted (`SUBCONTRACTED`) which node.
- `versions.ts` / `changes.ts` — version history, change records, change
  reviews, and change risk scores (spec §15–17, §23).

**What deliberately does NOT exist** (per explicit instruction mid-session):
`db/notifications.ts`, `db/reports.ts` (daily reports), `db/evidence.ts`.
The corresponding `app/**/notifications/`, `app/**/daily-reports/`, and
`app/**/settings/` pages are all still "coming soon" placeholders
(`components/coming-soon.tsx`) for this reason — there's no data to back
them yet, not an oversight.

---

## 6. The project graph (this took several iterations — read this before touching it)

The project feature graph (`/project/[id]/project-graph` or
`/project/[id]/graph` for inspectors) is a real interactive node/edge
diagram built with **@xyflow/react**, laid out automatically by
**@dagrejs/dagre**. Key files:

- `lib/graph/layout.ts` — pure layout math, no React. `layoutWithDagre(nodeIds, edges, direction)`
  wraps dagre; `boundingBoxOf(...)` computes the rectangle around a cluster
  of nodes for the subcontractor grouping box.
- `components/graph/feature-node.tsx`, `group-node.tsx` — the two custom
  node renderers for the feature graph.
- `components/graph/contractor-node.tsx` — node renderer for the separate
  contractor-hierarchy graph.
- `components/graph/project-graph-flow.tsx` — the feature graph (client component).
- `components/graph/contractor-graph-flow.tsx` — the contractor hierarchy graph (client component).
- `components/project-graph-view.tsx` / `components/project-contractor-details-view.tsx` —
  server-side wrappers that fetch data via `db/queries.ts` and hand enriched
  props to the client graph components above.

### Edge direction convention — READ THIS BEFORE ADDING EDGES

Per `project_coding_spec.md` §10: `source → target` means **"target
depends on source."** Per `IMPORTANT.md`: "node at head of edge (parent) =
dependent on tail node (children)." Same rule, two phrasings: the tail
(source) is the prerequisite/child, the head (target) is the
dependent/parent.

This one convention is what makes the whole hierarchy renderable as a
single graph:
- A subfeature's edge points **into** its feature (`wiring → electrical`
  means electrical depends on wiring).
- A feature's edge points **into** the project root (`structure → root`
  means the project depends on structure). These root-connecting edges
  were **added by us** (not in the original spec's edge examples) — see
  `db/edges.ts`'s top comment — specifically so the root has something to
  connect to.

### Why two different dagre directions

- **Feature graph**: the project root is the *sink* (everything points
  into it), and we want the root to render at the **top**. Sinks end up on
  top only with `rankdir: "BT"` (verified: dagre's `BT` mode runs a normal
  top-to-bottom layout internally then negates all the y-coordinates — so
  higher-rank/more-depended-on nodes, i.e. the root, end up with the most
  negative/topmost y).
- **Contractor hierarchy graph**: edges go `parent contractor → child
  contractor` (source = parent, target = child), and the main contractor
  (the source, rank 0) should render at the **top** — which is what
  `rankdir: "TB"` does natively (rank 0 nodes get the smallest y).

### The handle-direction bug we hit (don't reintroduce it)

`@xyflow/react` nodes have `<Handle type="source">` / `<Handle
type="target">` elements with a **fixed type baked into the node
component**, independent of layout direction. We initially copy-pasted the
"normal" convention (target handle on top, source handle on bottom) onto
**both** graphs. That's correct for the contractor graph (`TB`: source/parent
is physically above target/child, so source-exits-bottom /
target-receives-top is right). But it's **backwards** for the feature graph
(`BT`: target is physically above source, since e.g. `structure`'s target,
the root, ends up above it) — with the handles backwards, every edge had to
loop around the sides of the boxes to satisfy both fixed handle positions,
producing the "arrows coming out of the wrong side" mess you'd see if you
swap them back.

**Current (correct) state:**
- `components/graph/feature-node.tsx` — top handle is `type="source"`,
  bottom handle is `type="target"` (graph flows bottom-to-top).
- `components/graph/contractor-node.tsx` — top handle is `type="target"`,
  bottom handle is `type="source"` (graph flows top-to-bottom, the normal way).
- Edge construction in each `*-graph-flow.tsx` file must match: feature
  graph edges use `sourceHandle: "t", targetHandle: "b"`; contractor graph
  edges use `sourceHandle: "b", targetHandle: "t"`.

If you add a third graph type, work out which end of each edge is
physically higher **first**, then set handle types to match — don't just
copy one of the two existing node components.

### Interactivity

- Every feature/contractor node is `draggable: true`.
- Nodes handed to a subcontractor (`assignmentType: "SUBCONTRACTED"` in
  `feature-assignments.ts`) are enclosed in a light dashed rectangle. This
  is implemented as a **real `@xyflow/react` parent/child group** (the
  group node has `type: "group"`; member nodes get `parentId` + `extent:
  "parent"`), not a manually-positioned decoration — so dragging a member
  node stays confined inside the box, and dragging the box itself moves the
  whole cluster together. `db/queries.ts#getSubcontractedNodeGroups`
  computes which nodes belong in which box.
- Clicking a feature node opens a detail side panel (id, description,
  status, progress, `shouldCompleteBy`, metadata key/values, assigned
  contractor, creator, timestamps). Clicking a group box does nothing
  (filtered out in the `onNodeClick` handler).
- `nodesConnectable={false}` on both graphs — dragging to create new edges
  is intentionally disabled since there's no UI/backend yet for editing the
  graph structure (spec §49 describes this flow but it isn't built).

---

## 7. What's real vs. placeholder — quick reference

| Page | Status |
|---|---|
| Landing / login / register | Real (against `db/users.ts`) |
| `projects` (all 3 roles) | Real — filtered per-user via `getProjectsForUser` |
| `projects` "New Project" button (stakeholder only) | **Inert** — renders, does nothing on click, on purpose (contractors are assigned to projects, they don't create them) |
| Project overview | Real |
| `dashboard` (contractor/stakeholder) | Real — spec §47's 7 cards |
| `project-graph` / `graph` (all 3 roles) | Real — see §6 |
| `stakeholder-details` (contractor's view) | Real |
| `contractor-details` (stakeholder's view) | Real — rendered as a graph, see §6 |
| `subcontractors` (contractor only) | Real — filtered to the logged-in contractor's own subs on that project |
| `changes` (all 3 roles) | Real — shows before/after, reason, reviewer decision, risk score |
| `daily-reports`, `notifications`, `settings` (all roles) | **Coming soon** — no data model yet |
| `profile` (all roles) | **Coming soon** |

---

## 8. Known gaps worth knowing about before extending this

- **No inspector↔project scoping table.** The spec never defines one, so
  `getProjectsForUser` currently returns *every* project for inspectors.
  If the spec ever adds one, update that function (it's flagged with a
  comment).
- **`register()` mutates an in-memory array** — new accounts vanish on
  server restart. Fine for a demo, not for anything real.
- **Approving a `PENDING` change doesn't currently update the underlying
  entity.** E.g. `project-1`'s pending budget change (`change-3`,
  500M → 650M) sits there as a change record, but nothing recalculates
  `project.contractValue` if you flip its status to `APPROVED` — there's no
  review-approval action wired up yet, only read-only display.
- **No DAG cycle validation** (spec §11 describes `wouldCreateCycle`) —
  moot right now since there's no UI to add edges, but if you build one,
  this still needs implementing.
- **No server-side permission enforcement** beyond "is this your project"
  route guards (spec §38–39 describe a fuller permission model —
  OWNER/EDITOR/VIEWER distinctions, contractor-can't-touch-contractor-above-it,
  etc. — none of that is enforced yet, only role-level route gating).
- Route param naming is inconsistent on purpose (`[projectId]` for
  contractor/stakeholder, `[project_id]` for inspector) — this mirrors how
  the route structure was originally specified, not a typo. Don't
  "normalize" it without checking that nothing depends on the current names.
