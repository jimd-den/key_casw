
import type { MysteryCase } from '@/core/enterprise/entities/mystery-case.entity';
import type { CreateCaseInputDTO } from '@/core/application/use-cases/case/create-case.use-case';

export interface ICaseRepository {
  findById(id: string): Promise<MysteryCase | undefined>;
  findAll(): Promise<MysteryCase[]>;
  findAllPublished(): Promise<MysteryCase[]>;
  save(caseData: CreateCaseInputDTO & { authorId: string }): Promise<MysteryCase>;
  // update(mysteryCase: MysteryCase): Promise<MysteryCase | undefined>; // If updates are needed
  // delete(id: string): Promise<boolean>; // If deletion is needed
}
