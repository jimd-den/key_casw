
import type { MysteryCase, Difficulty } from '@/core/enterprise/entities/mystery-case.entity';
import type { EvidenceType } from '@/core/enterprise/entities/evidence.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';
import { z } from 'zod';

const EvidenceSchemaDTO = z.object({
  title: z.string().min(1, "Evidence title is required."),
  type: z.enum(['picture', 'document', 'audio', 'note']),
  content: z.string().min(1, "Evidence content is required."),
  description: z.string().optional(),
  fileName: z.string().optional(),
});

export const CreateCaseSchemaDTO = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  evidence: z.array(EvidenceSchemaDTO).min(1, "At least one piece of evidence is required."),
  suspects: z.array(z.string().min(1)).min(1, "At least one suspect is required."),
  victims: z.array(z.string().min(1)).min(1, "At least one victim is required."),
  solution: z.string().min(10, "Solution must be at least 10 characters long."),
  isPublished: z.boolean().default(false),
});

export type CreateCaseInputDTO = z.infer<typeof CreateCaseSchemaDTO>;

interface CreateCaseOutput {
  success: boolean;
  message: string;
  caseDetails?: MysteryCase;
  errors?: z.ZodError<CreateCaseInputDTO>;
}

export class CreateCaseUseCase {
  constructor(private caseRepository: ICaseRepository) {}

  async execute(input: CreateCaseInputDTO, authorId: string): Promise<CreateCaseOutput> {
    const validationResult = CreateCaseSchemaDTO.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validationResult.error,
      };
    }

    try {
      // Simulate file uploads for 'picture', 'document', 'audio' if content isn't a URL or text marker
      const processedEvidence = validationResult.data.evidence.map(ev => {
        if (['picture', 'document', 'audio'].includes(ev.type) && !ev.content.startsWith('https://') && !ev.content.startsWith('http://') && !ev.content.startsWith('Text:')) {
          return { 
            ...ev, 
            // In a real app, file handling logic to upload and get a URL would be here or in a service.
            // For demo, we use a placeholder.
            content: `https://picsum.photos/seed/${encodeURIComponent(ev.title)}/400/300`, 
            fileName: ev.fileName || `${ev.type}_file_${Date.now()}.dat` 
          };
        }
        return ev;
      });

      const newCaseData = {
        ...validationResult.data,
        evidence: processedEvidence,
        authorId,
      };
      
      const createdCase = await this.caseRepository.save(newCaseData);
      return {
        success: true,
        message: `Case "${createdCase.title}" created successfully!`,
        caseDetails: createdCase,
      };
    } catch (error) {
      console.error("Error in CreateCaseUseCase:", error);
      return {
        success: false,
        message: "Failed to create case due to an unexpected error.",
      };
    }
  }
}
