import { CaseDetails } from "@/features/cases/components/case-details";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GetCaseByIdUseCase } from "@/core/application/use-cases/case/get-case-by-id.use-case";
import { ListCasesUseCase } from "@/core/application/use-cases/case/list-cases.use-case";
// import { InMemoryCaseRepository } from "@/core/interface-adapters/gateways/in-memory-case.repository"; // Replaced
import { FirebaseCaseRepository } from "@/core/interface-adapters/gateways/firebase-case.repository";

const caseRepository = new FirebaseCaseRepository(); // Shared instance for this page module

async function getCaseDetails(id: string) {
  const getCaseByIdUseCase = new GetCaseByIdUseCase(caseRepository);
  try {
    return await getCaseByIdUseCase.execute(id);
  } catch (error) {
    console.error(`Failed to fetch case ${id}:`, error);
    return null; // Return null on error
  }
}

async function getAllCasesForStaticParams() {
  const listCasesUseCase = new ListCasesUseCase(caseRepository);
  try {
    // Fetch only published cases for static params if that's the desired behavior
    // Or fetch all if even unpublished should have pre-rendered paths (though they'd show an error on page)
    return await listCasesUseCase.execute({ publishedOnly: true }); 
  } catch (error) {
    console.error("Failed to fetch cases for static params:", error);
    return [];
  }
}

interface MysteryPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  // Pre-render paths for existing cases to improve performance
  const cases = await getAllCasesForStaticParams();
  return cases.map((c) => ({
    id: c.id,
  }));
}
// export const dynamic = 'force-dynamic'; // Consider 'auto' or ISR if preferred.
// Using 'force-dynamic' ensures fresh data but skips SSG benefits for these paths.
// 'auto' (default) will attempt SSG based on generateStaticParams.
// If data changes frequently, 'force-dynamic' or ISR is better.
// For now, let Next.js decide with 'auto' (by removing force-dynamic).
// Let's make it dynamic to ensure freshness, as static params might not cover all cases if DB is updated post-build.
export const dynamic = 'force-dynamic'; 


export default async function MysteryPage({ params }: MysteryPageProps) {
  const mysteryCase = await getCaseDetails(params.id);

  if (!mysteryCase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
        <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-5 w-5"/>
            <AlertTitle>Mystery Not Found</AlertTitle>
            <AlertDescription>
            The case you are looking for does not exist or could not be loaded. It might have been removed or the ID is incorrect.
            </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
            <Link href="/mysteries">Back to Mysteries</Link>
        </Button>
      </div>
    );
  }
  
  if (!mysteryCase.isPublished) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
        <Alert variant="default" className="max-w-md">
            <AlertTriangle className="h-5 w-5"/>
            <AlertTitle>Case Not Published</AlertTitle>
            <AlertDescription>
            This mystery case is not yet published by its author.
            </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
            <Link href="/mysteries">Back to Mysteries</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <CaseDetails mysteryCase={mysteryCase} />
    </div>
  );
}
