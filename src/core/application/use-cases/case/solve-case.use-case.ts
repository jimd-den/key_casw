
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';
import { z } from 'zod';

export const SolveCaseSchemaDTO = z.object({
  caseId: z.string().min(1, "Case ID is required."),
  guess: z.string().min(5, "Your guess must be at least 5 characters long."),
});

export type SolveCaseInputDTO = z.infer<typeof SolveCaseSchemaDTO>;

export interface SolveCaseOutputDTO {
  success: boolean;
  message: string;
  isCorrect?: boolean;
  errors?: z.ZodError<SolveCaseInputDTO>;
}

export class SolveCaseUseCase {
  constructor(private caseRepository: ICaseRepository) {}

  async execute(input: SolveCaseInputDTO): Promise<SolveCaseOutputDTO> {
    const validationResult = SolveCaseSchemaDTO.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid submission.",
        errors: validationResult.error,
      };
    }

    const { caseId, guess } = validationResult.data;

    try {
      const mysteryCase = await this.caseRepository.findById(caseId);
      if (!mysteryCase) {
        return { success: false, message: "Case not found." };
      }

      // Simple string comparison for solution (case-insensitive, trim whitespace)
      const isCorrect =
        mysteryCase.solution.trim().toLowerCase() ===
        guess.trim().toLowerCase();

      if (isCorrect) {
        return { success: true, message: "Congratulations! Your solution is correct!", isCorrect: true };
      } else {
        return { success: true, message: "That's not quite right. Keep investigating!", isCorrect: false };
      }
    } catch (error) {
      console.error("Error in SolveCaseUseCase:", error);
      return { success: false, message: "Error submitting solution due to an unexpected error." };
    }
  }
}
