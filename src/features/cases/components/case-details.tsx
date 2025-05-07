
"use client";

import type { MysteryCase } from "@/core/enterprise/entities/mystery-case.entity"; // Updated import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceList } from "./evidence-list";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "react-dom";
import { solveCaseAction } from "@/lib/actions/case.actions";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Users, Target, CalendarDays, User, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface CaseDetailsProps {
  mysteryCase: MysteryCase;
}

export function CaseDetails({ mysteryCase }: CaseDetailsProps) {
  const { id, title, description, difficulty, authorId, evidence, suspects, victims, createdAt } = mysteryCase;
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const [notes, setNotes] = useState(""); // Client-side notes
  
  const [solutionGuess, setSolutionGuess] = useState("");
  const [isSolutionSubmitted, setIsSolutionSubmitted] = useState(false);


  const initialState = { message: "", success: false, isCorrect: false };
  const [state, formAction] = useFormState(solveCaseAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Load notes from localStorage if available
    const savedNotes = localStorage.getItem(`caseNotes-${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id]);

  useEffect(() => {
    // Save notes to localStorage on change
    localStorage.setItem(`caseNotes-${id}`, notes);
  }, [notes, id]);


  useEffect(() => {
    if (state.message && isSolutionSubmitted) { 
      toast({
        title: state.isCorrect ? "Correct!" : state.success ? "Feedback" : "Error",
        description: state.message,
        variant: state.isCorrect ? "default" : state.success ? "default" : "destructive",
        duration: state.isCorrect ? 8000 : 5000,
      });
      if (state.success && state.isCorrect) {
        setSolutionGuess(""); 
      }
      setIsSolutionSubmitted(false); 
    }
  }, [state, toast, isSolutionSubmitted]);

  const handleFormSubmit = (formData: FormData) => {
    setIsSolutionSubmitted(true);
    formAction(formData);
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="text-3xl font-bold mb-2 sm:mb-0">{title}</CardTitle>
            <Badge 
              variant={difficulty === "Easy" ? "default" : difficulty === "Medium" ? "secondary" : "destructive"}
              className="capitalize text-md px-3 py-1"
              style={difficulty === "Easy" ? { backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))' } : 
                     difficulty === "Medium" ? { backgroundColor: 'hsl(var(--chart-4))', color: 'hsl(var(--primary-foreground))' } :
                                               { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}
            >
              {difficulty}
            </Badge>
          </div>
          <CardDescription className="text-md text-muted-foreground pt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="flex items-center"><User className="h-5 w-5 mr-2 text-primary" /> Author: {authorId.substring(0,12)}...</p>
            <p className="flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-primary" /> Created: {formattedDate}</p>
            <p className="flex items-start col-span-1 sm:col-span-2"><Users className="h-5 w-5 mr-2 text-primary mt-1 shrink-0" /> Suspects: {suspects.join(", ")}</p>
            <p className="flex items-start col-span-1 sm:col-span-2"><Target className="h-5 w-5 mr-2 text-primary mt-1 shrink-0" /> Victims: {victims.join(", ")}</p>
          </div>
        </CardContent>
      </Card>

      <EvidenceList evidence={evidence} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Your Detective Notes</CardTitle>
          <CardDescription>Jot down your thoughts and theories here. Notes are saved locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Start typing your notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Submit Your Solution</CardTitle>
          <CardDescription>Think you've cracked the case? Submit your theory below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleFormSubmit} className="space-y-4">
            <input type="hidden" name="caseId" value={id} />
            <Textarea
              name="guess"
              placeholder="Who did it and how? Explain your reasoning..."
              rows={5}
              value={solutionGuess}
              onChange={(e) => setSolutionGuess(e.target.value)}
              required
              className="resize-none"
            />
            {state.errors?.guess && (
                <p className="text-sm text-destructive">{state.errors.guess.join(", ")}</p>
            )}
            <div className="flex justify-end space-x-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" type="button">
                      <Lightbulb className="mr-2 h-4 w-4" /> View Actual Solution
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Case Solution</DialogTitle>
                      <DialogDescription>
                        This is the official solution provided by the case author.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-foreground bg-secondary p-3 rounded-md">{mysteryCase.solution}</p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button type="submit" disabled={!solutionGuess.trim() || isSolutionSubmitted}>
                    <Send className="mr-2 h-4 w-4" /> {isSolutionSubmitted ? "Submitting..." : "Submit Guess"}
                </Button>
            </div>
          </form>
          {state.message && state.success && !state.errors && isSolutionSubmitted && ( // Show alert only after submission and if it's from this interaction
             <Alert variant={state.isCorrect ? "default" : "destructive"} className="mt-4 bg-opacity-10">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>{state.isCorrect ? "Correct!" : "Feedback"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
