
import { CaseDetails } from "@/features/cases/components/case-details";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GetCaseByIdUseCase } from "@/core/application/use-cases/case/get-case-by-id.use-case";
import { ListCasesUseCase } from "@/core/application/use-cases/case/list-cases.use-case";
import { InMemoryCaseRepository } from "@/core/interface-adapters/gateways/in-memory-case.repository";

const caseRepository = new InMemoryCaseRepository(); // Shared instance for this page module

async function getCaseDetails(id: string) {
  const getCaseByIdUseCase = new GetCaseByIdUseCase(caseRepository);
  return await getCaseByIdUseCase.execute(id);
}

async function getAllCasesForStaticParams() {
  const listCasesUseCase = new ListCasesUseCase(caseRepository);
  return await listCasesUseCase.execute(); // Get all cases for param generation
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
export const dynamic = 'force-dynamic'; // Or 'auto' if preferred, but force-dynamic ensures fresh data for dynamic paths

export default async function MysteryPage({ params }: MysteryPageProps) {
  const mysteryCase = await getCaseDetails(params.id);

  if (!mysteryCase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
        <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-5 w-5"/>
            <AlertTitle>Mystery Not Found</AlertTitle>
            <AlertDescription>
            The case you are looking for does not exist or could not be loaded.
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
