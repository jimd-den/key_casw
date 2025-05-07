
import type { MysteryCase } from '@/core/enterprise/entities/mystery-case.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';

export class GetCaseByIdUseCase {
  constructor(private caseRepository: ICaseRepository) {}

  async execute(id: string): Promise<MysteryCase | undefined> {
    try {
      return await this.caseRepository.findById(id);
    } catch (error) {
      console.error(`Error fetching case with ID ${id}:`, error);
      // Depending on requirements, could throw a custom error or return undefined
      return undefined;
    }
  }
}
