
import type { Evidence } from './evidence.entity';

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
