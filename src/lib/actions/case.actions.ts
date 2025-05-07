"use server";

import type { MysteryCase, Difficulty } from "@/types";
import { addCase as dbAddCase, getCaseById as dbGetCaseById } from "@/lib/data-store";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EvidenceSchema = z.object({
  title: z.string().min(1, "Evidence title is required."),
  type: z.enum(['picture', 'document', 'audio', 'note']),
  content: z.string().min(1, "Evidence content is required."), // URL for files, or text for notes
  description: z.string().optional(),
  fileName: z.string().optional(),
});

export const CreateCaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  authorId: z.string(), // This should be set by the server based on logged-in user
  evidence: z.array(EvidenceSchema).min(1, "At least one piece of evidence is required."),
  suspects: z.array(z.string().min(1)).min(1, "At least one suspect is required."),
  victims: z.array(z.string().min(1)).min(1, "At least one victim is required."),
  solution: z.string().min(10, "Solution must be at least 10 characters long."),
  isPublished: z.boolean().default(false),
});

export type CreateCaseInput = z.infer<typeof CreateCaseSchema>;

interface FormState {
  message: string;
  errors?: Record<string, string[] | undefined>;
  fieldValues?: CreateCaseInput;
  success: boolean;
  caseId?: string;
}

export async function createCaseAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  // Manually construct evidence array from formData
  const evidence: Array<z.infer<typeof EvidenceSchema>> = [];
  let i = 0;
  while (rawFormData[`evidence[${i}].title`]) {
    evidence.push({
      title: rawFormData[`evidence[${i}].title`] as string,
      type: rawFormData[`evidence[${i}].type`] as 'picture' | 'document' | 'audio' | 'note',
      content: rawFormData[`evidence[${i}].content`] as string, // For demo, actual file upload would be complex
      description: rawFormData[`evidence[${i}].description`] as string | undefined,
      fileName: rawFormData[`evidence[${i}].fileName`] as string | undefined,
    });
    i++;
  }
  
  // Process suspects and victims which are comma-separated strings
   const suspectsString = rawFormData.suspects as string || "";
   const victimsString = rawFormData.victims as string || "";


  const parsedData = {
    title: rawFormData.title,
    description: rawFormData.description,
    difficulty: rawFormData.difficulty,
    authorId: rawFormData.authorId, // In real app, get from session
    solution: rawFormData.solution,
    isPublished: rawFormData.isPublished === 'on' || rawFormData.isPublished === 'true',
    evidence,
    suspects: suspectsString.split(',').map(s => s.trim()).filter(s => s),
    victims: victimsString.split(',').map(v => v.trim()).filter(v => v),
  };
  
  const validatedFields = CreateCaseSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: "Validation failed. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: parsedData as CreateCaseInput, // Cast, as it's partially valid for re-populating form
      success: false,
    };
  }
  
  try {
    // Simulate file uploads for 'picture', 'document', 'audio'
    // In a real app, this would involve saving files to storage and getting URLs
    const processedEvidence = validatedFields.data.evidence.map(ev => {
      if (['picture', 'document', 'audio'].includes(ev.type) && !ev.content.startsWith('https://') && !ev.content.startsWith('Text:')) {
        // This is a mock placeholder for uploaded file content.
        // In a real app, you'd handle actual file data and store it.
        return { ...ev, content: `https://picsum.photos/seed/${ev.title.replace(/\s+/g, '-')}/400/300`, fileName: ev.fileName || `${ev.type}_file.dat` };
      }
      return ev;
    });


    const newCaseData = {
      ...validatedFields.data,
      evidence: processedEvidence,
    };

    const newCase = await dbAddCase(newCaseData);
    revalidatePath("/mysteries");
    revalidatePath(`/mysteries/${newCase.id}`);
    revalidatePath("/create-case"); // To clear the form potentially

    return {
      message: `Case "${newCase.title}" created successfully!`,
      success: true,
      caseId: newCase.id,
    };
  } catch (error) {
    console.error("Error creating case:", error);
    return {
      message: "Failed to create case. An unexpected error occurred.",
      fieldValues: validatedFields.data,
      success: false,
    };
  }
}


const SolveCaseSchema = z.object({
  caseId: z.string(),
  guess: z.string().min(5, "Your guess must be at least 5 characters long."),
});

interface SolveFormState {
    message: string;
    isCorrect?: boolean;
    success: boolean;
    errors?: Record<string, string[] | undefined>;
}

export async function solveCaseAction(
  prevState: SolveFormState,
  formData: FormData
): Promise<SolveFormState> {
  const rawFormData = {
    caseId: formData.get("caseId") as string,
    guess: formData.get("guess") as string,
  };

  const validatedFields = SolveCaseSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      message: "Invalid submission.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const mysteryCase = await dbGetCaseById(validatedFields.data.caseId);
    if (!mysteryCase) {
      return { message: "Case not found.", success: false };
    }

    // Simple string comparison for solution (case-insensitive, trim whitespace)
    const isCorrect =
      mysteryCase.solution.trim().toLowerCase() ===
      validatedFields.data.guess.trim().toLowerCase();

    if (isCorrect) {
      return { message: "Congratulations! Your solution is correct!", isCorrect: true, success: true };
    } else {
      return { message: "That's not quite right. Keep investigating!", isCorrect: false, success: true };
    }
  } catch (error) {
    return { message: "Error submitting solution.", success: false };
  }
}
