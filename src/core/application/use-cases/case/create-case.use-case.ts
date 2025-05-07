import type { MysteryCase, Difficulty } from '@/core/enterprise/entities/mystery-case.entity';
import type { EvidenceType, Evidence } from '@/core/enterprise/entities/evidence.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';
import { z } from 'zod';

const EvidenceSchemaDTO = z.object({
  title: z.string().min(1, "Evidence title is required.").max(100, "Title too long."),
  type: z.enum(['picture', 'document', 'audio', 'note']),
  content: z.string().min(1, "Evidence content is required."),
  description: z.string().max(500, "Description too long.").optional(),
  fileName: z.string().max(100, "Filename too long.").optional(),
  dataAiHint: z.string().max(50, "AI hint too long").optional(), // Added
});

export const CreateCaseSchemaDTO = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(150, "Title too long."),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(2000, "Description too long."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  evidence: z.array(EvidenceSchemaDTO).min(1, "At least one piece of evidence is required.").max(10, "Maximum 10 pieces of evidence."),
  suspects: z.array(z.string().min(1, "Suspect name cannot be empty.").max(100, "Suspect name too long.")).min(1, "At least one suspect is required.").max(10, "Maximum 10 suspects."),
  victims: z.array(z.string().min(1, "Victim name cannot be empty.").max(100, "Victim name too long.")).min(1, "At least one victim is required.").max(5, "Maximum 5 victims."),
  solution: z.string().min(10, "Solution must be at least 10 characters long.").max(2000, "Solution too long."),
  isPublished: z.boolean().default(false),
});

export type CreateCaseInputDTO = z.infer<typeof CreateCaseSchemaDTO>;

interface CreateCaseOutput {
  success: boolean;
  message: string;
  caseDetails?: MysteryCase;
  errors?: z.ZodError<CreateCaseInputDTO>; // Return ZodError for detailed client-side handling
}

export class CreateCaseUseCase {
  constructor(private caseRepository: ICaseRepository) {}

  async execute(input: CreateCaseInputDTO, authorId: string): Promise<CreateCaseOutput> {
    const validationResult = CreateCaseSchemaDTO.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed. Please check the form for errors.",
        errors: validationResult.error,
      };
    }

    try {
      // Simulate file uploads for 'picture', 'document', 'audio' if content isn't a URL or text marker
      // This logic might be better placed in a dedicated service or handled client-side before calling the action.
      // For Firestore, content should ideally be a URL (e.g., to Firebase Storage) or text.
      const processedEvidence = validationResult.data.evidence.map(ev => {
        if (['picture', 'document', 'audio'].includes(ev.type) && 
            !ev.content.startsWith('https://') && 
            !ev.content.startsWith('http://') && 
            !ev.content.startsWith('data:') && // Allow data URIs
            !(ev.type === 'document' && ev.content.startsWith('Text:'))
           ) {
          // If not a URL, data URI, or "Text:" prefixed document, assume it's a placeholder for mock upload.
          // In a real app, this would involve uploading to cloud storage and getting a URL.
          return { 
            ...ev, 
            // Replace with actual storage URL or keep as is if content is e.g. base64 data URI
            content: ev.content.startsWith('data:') ? ev.content : `https://picsum.photos/seed/${encodeURIComponent(ev.title)}/400/300`, 
            fileName: ev.fileName || `${ev.type}_file_${Date.now()}.dat`,
            dataAiHint: ev.dataAiHint || `${ev.title.substring(0,15)} ${ev.type}` // Generate a hint
          };
        }
        return ev;
      });

      const newCaseData = {
        ...validationResult.data,
        evidence: processedEvidence as Evidence[], // Cast after processing
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
        message: "Failed to create case due to an unexpected error. Please try again.",
      };
    }
  }
}
