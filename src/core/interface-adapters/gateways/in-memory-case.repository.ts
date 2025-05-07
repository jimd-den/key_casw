
import type { MysteryCase } from '@/core/enterprise/entities/mystery-case.entity';
import type { Evidence } from '@/core/enterprise/entities/evidence.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';
import type { CreateCaseInputDTO } from '@/core/application/use-cases/case/create-case.use-case';
import { initialMockCases } from '@/lib/mock-data';

// In-memory store, mimicking a database
let cases: MysteryCase[] = JSON.parse(JSON.stringify(initialMockCases)); // Deep copy to allow modification
let nextCaseIdCounter = initialMockCases.length > 0 ? Math.max(...initialMockCases.map(c => parseInt(c.id))) + 1 : 1;
let nextEvidenceIdCounter = initialMockCases.reduce((max, currentCase) => {
  const caseMaxEvidenceId = currentCase.evidence.length > 0 ? Math.max(...currentCase.evidence.map(e => parseInt(e.id))) : 0;
  return Math.max(max, caseMaxEvidenceId);
}, 0) + 1;


export class InMemoryCaseRepository implements ICaseRepository {
  async findById(id: string): Promise<MysteryCase | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
    return cases.find(c => c.id === id);
  }

  async findAll(): Promise<MysteryCase[]> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
    return [...cases]; // Return a copy
  }
  
  async findAllPublished(): Promise<MysteryCase[]> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async
    return cases.filter(c => c.isPublished);
  }

  async save(caseData: CreateCaseInputDTO & { authorId: string }): Promise<MysteryCase> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async
    
    const newId = (nextCaseIdCounter++).toString();
  
    const processedEvidence: Evidence[] = caseData.evidence.map(ev => ({
      ...ev,
      id: (nextEvidenceIdCounter++).toString(),
    }));

    const newCase: MysteryCase = {
      ...caseData,
      id: newId,
      evidence: processedEvidence,
      createdAt: new Date().toISOString(),
    };
    cases.push(newCase);
    return newCase;
  }

  // Helper for testing or resetting state if needed
  static resetStore(): void {
    cases = JSON.parse(JSON.stringify(initialMockCases));
    nextCaseIdCounter = initialMockCases.length > 0 ? Math.max(...initialMockCases.map(c => parseInt(c.id))) + 1 : 1;
    nextEvidenceIdCounter = initialMockCases.reduce((max, currentCase) => {
      const caseMaxEvidenceId = currentCase.evidence.length > 0 ? Math.max(...currentCase.evidence.map(e => parseInt(e.id))) : 0;
      return Math.max(max, caseMaxEvidenceId);
    }, 0) + 1;
  }
}
