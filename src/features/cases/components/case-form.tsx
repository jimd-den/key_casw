"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createCaseAction } from "@/lib/actions/case.actions";
import { CreateCaseSchemaDTO, type CreateCaseInputDTO } from "@/core/application/use-cases/case/create-case.use-case";
import type { Difficulty } from "@/core/enterprise/entities/mystery-case.entity";
import type { EvidenceType } from "@/core/enterprise/entities/evidence.entity";
import { FilePlus, PlusCircle, Trash2, Image as ImageIcon, FileText, FileAudio, StickyNote, Loader2 } from "lucide-react";
import { useFormState } from "react-dom";
import { useEffect } from "react";

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const evidenceTypes: { value: EvidenceType, label: string, icon: React.ElementType }[] = [
  { value: "picture", label: "Picture", icon: ImageIcon },
  { value: "document", label: "Document", icon: FileText },
  { value: "audio", label: "Audio", icon: FileAudio },
  { value: "note", label: "Text Note", icon: StickyNote },
];


export function CaseForm() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateCaseInputDTO>({ // Use CreateCaseInputDTO
    resolver: zodResolver(CreateCaseSchemaDTO), // Using DTO schema from use case
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Medium",
      evidence: [{ title: "", type: "note", content: "", description: "", dataAiHint: "" }],
      suspects: [],
      victims: [],
      solution: "",
      isPublished: false,
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "evidence",
  });

  const [state, formAction] = useFormState(createCaseAction, {
    message: "",
    success: false,
  });

  useEffect(() => {
    if (!currentUser && !authLoading) {
      toast({ title: "Unauthorized", description: "Please log in to create a case.", variant: "destructive" });
      router.push("/auth/login");
    }
  }, [currentUser, authLoading, router, toast]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success && state.caseId) {
        form.reset(); 
        router.push(`/mysteries/${state.caseId}`);
      } else if (!state.success && state.errors) {
        // This handles server-side validation errors returned by the action.
        // RHF's zodResolver handles client-side errors.
        Object.entries(state.errors).forEach(([key, value]) => {
          if (value && Array.isArray(value)) { // Ensure value is an array of strings
            form.setError(key as keyof CreateCaseInputDTO, {
              type: "server",
              message: value.join(", "),
            });
          }
        });
      }
    }
  }, [state, toast, router, form]);


  if (authLoading) return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading user...</p></div>;
  if (!currentUser) return null; 

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FilePlus className="mr-2 h-6 w-6" /> Create New Mystery Case
        </CardTitle>
        <CardDescription>
          Fill in the details to craft your intriguing mystery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            {currentUser?.id && <input type="hidden" name="authorId" value={currentUser.id} />}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="The Case of the..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="A brief overview of the mystery..." {...field} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">Evidence</FormLabel>
              {fields.map((item, index) => (
                <Card key={item.id} className="p-4 space-y-3 bg-secondary/50">
                   <FormField
                    control={form.control}
                    name={`evidence.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Security Photo, Witness Statement" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`evidence.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {evidenceTypes.map(et => <SelectItem key={et.value} value={et.value}>{React.createElement(et.icon, {className:"inline mr-2 h-4 w-4"})} {et.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`evidence.${index}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{form.watch(`evidence.${index}.type`) === 'note' ? 'Note Content' : 'File URL / Text Content / Data URI'}</FormLabel>
                        <FormControl>
                          {form.watch(`evidence.${index}.type`) === 'note' || form.watch(`evidence.${index}.type`) === 'document' ? (
                             <Textarea placeholder={form.watch(`evidence.${index}.type`) === 'document' ? "Text: Document content here or paste Data URI..." : "Your note content..."} {...field} />
                          ) : (
                            <Input placeholder="https://example.com/image.jpg or Data URI (data:image/...)" {...field} />
                          )}
                        </FormControl>
                         { (form.watch(`evidence.${index}.type`) !== 'note' ) &&
                            <FormDescription>For pictures/audio, use a direct URL or a Base64 Data URI. For documents, prefix text content with "Text: " or use a Data URI.</FormDescription>
                         }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   { (form.watch(`evidence.${index}.type`) !== 'note') &&
                    <FormField
                        control={form.control}
                        name={`evidence.${index}.fileName`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>File Name (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., evidence_audio.mp3" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   }
                   { (form.watch(`evidence.${index}.type`) === 'picture' ) &&
                    <FormField
                        control={form.control}
                        name={`evidence.${index}.dataAiHint`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>AI Hint for Image (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., 'security camera', 'document page'" {...field} /></FormControl>
                            <FormDescription>Keywords for placeholder image generation if URL is mock (max 2 words).</FormMessage>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   }
                  <FormField
                    control={form.control}
                    name={`evidence.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evidence Description (Author's Note)</FormLabel>
                        <FormControl><Textarea placeholder="Optional notes about this evidence..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />Remove Evidence
                  </Button>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: "", type: "note", content: "", description: "", dataAiHint: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />Add Evidence
              </Button>
            </div>

            <FormField
              control={form.control}
              name="suspects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suspects</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Comma-separated, e.g., John Doe, Jane Smith" 
                      value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    />
                  </FormControl>
                  <FormDescription>Enter suspect names or descriptions, separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="victims"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Victims</FormLabel>
                  <FormControl>
                     <Input 
                      placeholder="Comma-separated, e.g., Mr. Body, The Museum" 
                      value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    />
                  </FormControl>
                  <FormDescription>Enter victim names or entities, separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Solution</FormLabel>
                  <FormControl><Textarea placeholder="Explain the solution to the mystery..." {...field} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Publish Case
                    </FormLabel>
                    <FormDescription>
                      Make this case visible to others for solving.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Case...</> : "Create Case"}
            </Button>
            {state.message && !state.success && state.errors?._form && (
              <p className="text-sm font-medium text-destructive">{state.errors._form.join(', ')}</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
