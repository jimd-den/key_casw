import { CaseCard } from "@/features/cases/components/case-card";
import { SearchX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListCasesUseCase } from "@/core/application/use-cases/case/list-cases.use-case";
// import { InMemoryCaseRepository } from "@/core/interface-adapters/gateways/in-memory-case.repository"; // Replaced
import { FirebaseCaseRepository } from "@/core/interface-adapters/gateways/firebase-case.repository";

async function getPublishedCases() {
  const caseRepository = new FirebaseCaseRepository();
  const listCasesUseCase = new ListCasesUseCase(caseRepository);
  try {
    return await listCasesUseCase.execute({ publishedOnly: true });
  } catch (error) {
    console.error("Failed to fetch published cases:", error);
    return []; // Return empty array on error to prevent page crash
  }
}

export default async function MysteriesPage() {
  const cases = await getPublishedCases();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Available Mysteries
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose a case and put your detective skills to the test.
        </p>
      </div>

      {cases.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cases.map((mysteryCase) => (
            <CaseCard key={mysteryCase.id} mysteryCase={mysteryCase} />
          ))}
        </div>
      ) : (
        <Alert variant="default" className="max-w-md mx-auto">
          <SearchX className="h-5 w-5" />
          <AlertTitle>No Mysteries Found</AlertTitle>
          <AlertDescription>
            It seems there are no mysteries available to solve at the moment.
            Why not <a href="/create-case" className="font-semibold text-primary hover:underline">create one</a>?
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
