import { CaseDetails } from "@/features/cases/components/case-details";
import { getCaseById, getCases } from "@/lib/data-store";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MysteryPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  // Pre-render paths for existing cases to improve performance
  const cases = await getCases();
  return cases.map((c) => ({
    id: c.id,
  }));
}

export default async function MysteryPage({ params }: MysteryPageProps) {
  const mysteryCase = await getCaseById(params.id);

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
