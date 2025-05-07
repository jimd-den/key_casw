
import type { MysteryCase } from "@/core/enterprise/entities/mystery-case.entity"; // Updated import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Puzzle, User, CalendarDays } from "lucide-react"; // Removed BarChart3 as it wasn't used
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface CaseCardProps {
  mysteryCase: MysteryCase;
}

// Helper to get a preview image URL or a placeholder
const getPreviewImageUrl = (mysteryCase: MysteryCase) => {
  const pictureEvidence = mysteryCase.evidence.find(e => e.type === 'picture' && (e.content.startsWith('http://') || e.content.startsWith('https://')));
  if (pictureEvidence) {
    return pictureEvidence.content;
  }
  // Fallback placeholder if no suitable picture evidence is found
  return `https://picsum.photos/seed/${mysteryCase.id}/400/200`;
};


export function CaseCard({ mysteryCase }: CaseCardProps) {
  const { id, title, description, difficulty, authorId, createdAt } = mysteryCase;
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const previewImageUrl = getPreviewImageUrl(mysteryCase);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative h-48 w-full">
        <Image 
          src={previewImageUrl} 
          alt={`Preview for ${title}`} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint={mysteryCase.evidence.find(e => e.type === 'picture')?.dataAiHint || "mystery crime"}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <Badge 
            variant={difficulty === "Easy" ? "default" : difficulty === "Medium" ? "secondary" : "destructive"}
            className="capitalize whitespace-nowrap ml-2"
            // Use custom colors for difficulty badges to stand out more
            style={difficulty === "Easy" ? { backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))' } : 
                   difficulty === "Medium" ? { backgroundColor: 'hsl(var(--chart-4))', color: 'hsl(var(--primary-foreground))' } :
                                             { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}
          >
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-primary" /> Author: {authorId.substring(0,12)}... 
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" /> Created: {formattedDate}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/mysteries/${id}`} passHref legacyBehavior>
          <Button className="w-full">
            <Puzzle className="mr-2 h-4 w-4" /> View Case
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
