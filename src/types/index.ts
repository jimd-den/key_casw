
export interface User {
  id: string; // Could be the public key
  publicKey: string;
  username?: string; // Optional username or alias
}

export type EvidenceType = 'picture' | 'document' | 'audio' | 'note';

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  content: string; // URL for files, or text for notes
  description?: string; // Author's notes about this evidence
  fileName?: string; // Original file name for uploads
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MysteryCase {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  authorId: string; // User ID of the creator
  evidence: Evidence[];
  suspects: string[]; // Names or descriptions
  victims: string[];  // Names or descriptions
  solution: string;   // The correct solution to the mystery
  isPublished: boolean;
  createdAt: string; // ISO date string
}
