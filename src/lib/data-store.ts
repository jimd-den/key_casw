import type { MysteryCase } from "@/types";
import { initialMockCases } from "./mock-data";

// In-memory store
let cases: MysteryCase[] = [...initialMockCases]; // Initialize with mock data
let nextCaseId = initialMockCases.length > 0 ? Math.max(...initialMockCases.map(c => parseInt(c.id))) + 1 : 1;
let nextEvidenceId = initialMockCases.reduce((max, currentCase) => {
  const caseMaxEvidenceId = currentCase.evidence.length > 0 ? Math.max(...currentCase.evidence.map(e => parseInt(e.id))) : 0;
  return Math.max(max, caseMaxEvidenceId);
}, 0) + 1;


export const getCases = async (): Promise<MysteryCase[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return cases.filter(c => c.isPublished);
};

export const getCaseById = async (id: string): Promise<MysteryCase | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return cases.find(c => c.id === id);
};

export const addCase = async (newCaseData: Omit<MysteryCase, 'id' | 'createdAt' | 'evidence'> & { evidence: Omit<MysteryCase['evidence'][0], 'id'>[] }): Promise<MysteryCase> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newId = (nextCaseId++).toString();
  
  const processedEvidence = newCaseData.evidence.map(ev => ({
    ...ev,
    id: (nextEvidenceId++).toString(),
  }));

  const newCase: MysteryCase = {
    ...newCaseData,
    id: newId,
    evidence: processedEvidence,
    createdAt: new Date().toISOString(),
  };
  cases.push(newCase);
  return newCase;
};

// Function to reset the store, primarily for testing or specific scenarios
export const resetCases = (newCases: MysteryCase[] = []) => {
  cases = [...newCases];
  nextCaseId = newCases.length > 0 ? Math.max(...newCases.map(c => parseInt(c.id))) + 1 : 1;
  nextEvidenceId = newCases.reduce((max, currentCase) => {
    const caseMaxEvidenceId = currentCase.evidence.length > 0 ? Math.max(...currentCase.evidence.map(e => parseInt(e.id))) : 0;
    return Math.max(max, caseMaxEvidenceId);
  }, 0) + 1;
};

// Initialize with mock data when module loads, if desired (already done above)
// resetCases(initialMockCases);
