"use server";

import { revalidatePath } from "next/cache";
// import { InMemoryCaseRepository } from "@/core/interface-adapters/gateways/in-memory-case.repository"; // Replaced
import { FirebaseCaseRepository } from "@/core/interface-adapters/gateways/firebase-case.repository";
import { CreateCaseUseCase, CreateCaseSchemaDTO, type CreateCaseInputDTO } from "@/core/application/use-cases/case/create-case.use-case";
import { SolveCaseUseCase, SolveCaseSchemaDTO, type SolveCaseInputDTO } from "@/core/application/use-cases/case/solve-case.use-case";
import { z } from "zod";

const caseRepository = new FirebaseCaseRepository();

// --- Create Case Action ---
interface CreateCaseFormState {
  message: string;
  errors?: Partial<Record<keyof CreateCaseInputDTO | '_form', string[]>>; 
  fieldValues?: CreateCaseInputDTO;
  success: boolean;
  caseId?: string;
}

export async function createCaseAction(
  prevState: CreateCaseFormState,
  formData: FormData
): Promise<CreateCaseFormState> {
  
  const rawFormData = Object.fromEntries(formData.entries());
  
  const evidenceArray: Array<{ title: string; type: 'picture' | 'document' | 'audio' | 'note'; content: string; description?: string; fileName?: string; dataAiHint?: string; }> = [];
  let i = 0;
  while (rawFormData[`evidence[${i}].title`]) {
    evidenceArray.push({
      title: rawFormData[`evidence[${i}].title`] as string,
      type: rawFormData[`evidence[${i}].type`] as 'picture' | 'document' | 'audio' | 'note',
      content: rawFormData[`evidence[${i}].content`] as string,
      description: rawFormData[`evidence[${i}].description`] as string | undefined,
      fileName: rawFormData[`evidence[${i}].fileName`] as string | undefined,
      dataAiHint: rawFormData[`evidence[${i}].dataAiHint`] as string | undefined, // Added
    });
    i++;
  }

  const suspectsString = rawFormData.suspects as string || "";
  const victimsString = rawFormData.victims as string || "";

  const caseData: CreateCaseInputDTO = {
    title: rawFormData.title as string,
    description: rawFormData.description as string,
    difficulty: rawFormData.difficulty as "Easy" | "Medium" | "Hard",
    solution: rawFormData.solution as string,
    isPublished: rawFormData.isPublished === 'on' || rawFormData.isPublished === 'true',
    evidence: evidenceArray,
    suspects: suspectsString.split(',').map(s => s.trim()).filter(s => s.length > 0),
    victims: victimsString.split(',').map(v => v.trim()).filter(v => v.length > 0),
  };
  
  const authorId = rawFormData.authorId as string;

  if (!authorId) {
    return {
      message: "User not authenticated.",
      success: false,
      errors: { _form: ["User not authenticated."] }
    };
  }

  const createCaseUseCase = new CreateCaseUseCase(caseRepository);
  // UseCase now handles validation internally
  const result = await createCaseUseCase.execute(caseData, authorId);


  if (!result.success) {
    return {
      message: result.message,
      // The use case now returns ZodError directly if validation fails
      errors: result.errors?.flatten().fieldErrors as CreateCaseFormState['errors'],
      fieldValues: caseData,
      success: false,
    };
  }

  revalidatePath("/mysteries");
  if (result.caseDetails?.id) {
    revalidatePath(`/mysteries/${result.caseDetails.id}`);
  }
  revalidatePath("/create-case"); // Or redirect from client after success

  return {
    message: result.message,
    success: true,
    caseId: result.caseDetails?.id,
  };
}


// --- Solve Case Action ---
interface SolveCaseFormState {
    message: string;
    isCorrect?: boolean;
    success: boolean;
    errors?: Partial<Record<keyof SolveCaseInputDTO | '_form', string[]>>;
}

export async function solveCaseAction(
  prevState: SolveCaseFormState,
  formData: FormData
): Promise<SolveCaseFormState> {
  
  const solveData: SolveCaseInputDTO = {
    caseId: formData.get("caseId") as string,
    guess: formData.get("guess") as string,
  };
  
  // Validation is now part of the use case
  const solveCaseUseCase = new SolveCaseUseCase(caseRepository);
  const result = await solveCaseUseCase.execute(solveData);

  if (!result.success) {
    return {
      message: result.message,
      errors: result.errors?.flatten().fieldErrors as SolveCaseFormState['errors'], // If ZodError is returned
      success: false,
    };
  }
  
  if (result.success) {
    // Optionally revalidate if solving a case changes its state (e.g., solved count)
    // This would ensure the page reflects any new data if re-rendered.
     revalidatePath(`/mysteries/${solveData.caseId}`);
  }


  return {
    message: result.message,
    isCorrect: result.isCorrect,
    success: true,
  };
}
