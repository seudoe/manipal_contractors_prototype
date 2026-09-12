/**
 * spec: project_coding_spec.md section 18 (Evidence) + section 26
 *
 * Actual files live in Supabase Storage under
 * projects/{projectId}/evidence/{changeId}/...; this table is just the
 * PostgreSQL-side metadata.
 */

export interface Evidence {
  id: string;
  projectId: string;
  changeId?: string;

  uploadedBy: string;

  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  documentHash?: string;

  createdAt: string;
}
