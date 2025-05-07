
import type { MysteryCase } from '@/core/enterprise/entities/mystery-case.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';

export class ListCasesUseCase {
  constructor(private caseRepository: ICaseRepository) {}

  async execute(options?: { publishedOnly?: boolean }): Promise<MysteryCase[]> {
    try {
      if (options?.publishedOnly) {
        return await this.caseRepository.findAllPublished();
      }
      return await this.caseRepository.findAll(); // Consider if admin needs all cases
    } catch (error) {
      console.error("Error listing cases:", error);
      return [];
    }
  }
}
