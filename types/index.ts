/**
 * Barrel export for every domain entity described in project_coding_spec.md
 * (sections 4-26). See individual files for which spec section each
 * interface comes from.
 *
 * The spec itself has a few internal inconsistencies (DB table columns vs.
 * the "Core TypeScript Interfaces" section, snake_case vs camelCase, etc.)
 * — these are transcribed as-is for now with a NOTE comment where spotted,
 * to be reconciled later rather than silently resolved here.
 */

export * from "./user";
export * from "./project";
export * from "./contractor";
export * from "./graph";
export * from "./change";
export * from "./evidence";
export * from "./report";
export * from "./notification";
export * from "./audit";

// ---- ANUBANDH prototype additions (plan.md/update (1).md) ----
export * from "./commitment";
export * from "./observation";
export * from "./deviation";
export * from "./verification";
export * from "./collusion";
export * from "./timeline";
