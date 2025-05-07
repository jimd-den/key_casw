import type { Evidence } from "@/types";
import { EvidenceItem } from "./evidence-item";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EvidenceListProps {
  evidence: Evidence[];
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  if (!evidence || evidence.length === 0) {
    return <p className="text-muted-foreground italic">No evidence available for this case.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Evidence Locker</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidence.map((item) => (
          <EvidenceItem key={item.id} evidence={item} />
        ))}
      </div>
    </div>
  );
}
