import type { Notification } from "@/types/notification";

/**
 * Empty on load. Populated at runtime by db/queries.ts#createNotification —
 * e.g. a stakeholder using "Assign to Contractor" (components/assign-contractor-button.tsx)
 * notifies that contractor. Mutated in place; not persisted across a server
 * restart, same as every other file in db/.
 */
export const notifications: Notification[] = [];
