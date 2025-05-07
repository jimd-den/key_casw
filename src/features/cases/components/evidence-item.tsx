import type { Evidence } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, FileText, FileAudio, StickyNote, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EvidenceItemProps {
  evidence: Evidence;
}

const EvidenceIcon = ({ type }: { type: Evidence['type'] }) => {
  switch (type) {
    case 'picture': return <ImageIcon className="h-5 w-5 text-primary" />;
    case 'document': return <FileText className="h-5 w-5 text-primary" />;
    case 'audio': return <FileAudio className="h-5 w-5 text-primary" />;
    case 'note': return <StickyNote className="h-5 w-5 text-primary" />;
    default: return <FileText className="h-5 w-5 text-primary" />;
  }
};

export function EvidenceItem({ evidence }: EvidenceItemProps) {
  const { title, type, content, description, fileName } = evidence;

  const isExternalUrl = content.startsWith('http://') || content.startsWith('https://');
  const isTextDocument = type === 'document' && content.startsWith('Text: ');
  const documentText = isTextDocument ? content.substring(6) : '';


  return (
    <Card className="overflow-hidden shadow-md w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <EvidenceIcon type={type} />
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="text-sm text-muted-foreground pt-1">
            Author's Note: {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {type === 'picture' && isExternalUrl && (
          <div className="relative aspect-video w-full rounded-md overflow-hidden border">
            <Image src={content} alt={title} layout="fill" objectFit="contain" data-ai-hint="evidence photo" />
          </div>
        )}
        {type === 'audio' && isExternalUrl && (
          <div className="space-y-2">
            <audio controls src={content} className="w-full">
              Your browser does not support the audio element.
            </audio>
             {fileName && <p className="text-xs text-muted-foreground">File: {fileName}</p>}
          </div>
        )}
        {isTextDocument && (
          <div className="p-3 bg-secondary/30 rounded-md border max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{documentText}</pre>
          </div>
        )}
        {type === 'note' && !isTextDocument && (
           <div className="p-3 bg-secondary/30 rounded-md border">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
        )}
        {/* For non-URL documents or non-picture/audio files that might be base64 or need download */}
        { (type === 'document' || type === 'audio' || type === 'picture') && !isExternalUrl && !isTextDocument && (
          <div className="p-3 bg-secondary/30 rounded-md border text-center">
            <p className="text-sm text-muted-foreground mb-2">
              This evidence type ({type}) with local content cannot be displayed directly in this demo.
            </p>
            {fileName && (
                 <Button variant="outline" size="sm" disabled>
                    <Download className="mr-2 h-4 w-4" /> Download {fileName} (mock)
                 </Button>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
