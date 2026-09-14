import type { DraftProject } from "./types";

function keyFor(email: string): string {
  return `new-project-draft:${email}`;
}

export function loadDraft(email: string): DraftProject | undefined {
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (!raw) return undefined;
    return JSON.parse(raw) as DraftProject;
  } catch {
    return undefined;
  }
}

export function saveDraft(email: string, draft: DraftProject): void {
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(draft));
  } catch {
    // localStorage can throw (private browsing, quota, etc.) — draft just
    // won't persist across sessions this time, not worth surfacing to the user
  }
}

export function clearDraft(email: string): void {
  try {
    localStorage.removeItem(keyFor(email));
  } catch {
    // see saveDraft
  }
}
