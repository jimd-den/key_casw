
import type { Evidence } from "@/core/enterprise/entities/evidence.entity"; // Updated import
import { EvidenceItem } from "./evidence-item";
// Removed ScrollArea as it's not used here and might be better handled by parent if needed.

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
          // Ensure item.id is unique and available. If evidence items don't have stable IDs from backend yet, use index as a fallback (not ideal for dynamic lists).
          // Assuming evidence items from the new structure will have unique IDs.
          <EvidenceItem key={item.id || item.title} evidence={item} />
        ))}
      </div>
    </div>
  );
}
