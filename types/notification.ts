/**
 * spec: project_coding_spec.md section 22 (Notifications)
 *
 * Every user-generated change produces notifications for other project users
 * EXCEPT the inspector, per the current product rule. Creation should happen
 * server-side after a successful change, not client-side.
 */

export interface Notification {
  id: string;
  projectId: string;
  recipientUserId: string;
  actorUserId: string;
  /** not enumerated in the spec — left as `string` for now */
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  readAt?: string | null;
  createdAt: string;
}
