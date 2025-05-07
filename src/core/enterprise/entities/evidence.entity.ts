
export type EvidenceType = 'picture' | 'document' | 'audio' | 'note';

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  content: string; // URL for files, or text for notes
  description?: string; // Author's notes about this evidence
  fileName?: string; // Original file name for uploads
  dataAiHint?: string; // For placeholder image generation
}
