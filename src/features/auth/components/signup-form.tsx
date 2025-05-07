"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").optional(),
  publicKey: z.string().min(10, "Public key seems too short."), // Simplified validation
});

// Simulate generating a key pair
const generateMockKeyPair = () => {
  const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
  return {
    publicKey: `pubkey-${randomString(12)}`,
    privateKey: `privkey-${randomString(12)}` // In real app, this is NOT sent or stored by server
  };
};


export function SignupForm() {
  const { signup, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [generatedKeys, setGeneratedKeys] = useState<{publicKey: string, privateKey: string} | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      publicKey: "",
    },
  });

  useEffect(() => {
    if (generatedKeys) {
      form.setValue("publicKey", generatedKeys.publicKey);
    }
  }, [generatedKeys, form]);

  const handleGenerateKeys = () => {
    const keys = generateMockKeyPair();
    setGeneratedKeys(keys);
    setShowPrivateKey(true); 
    toast({
      title: "Keys Generated (Mock)",
      description: "Your new public and private keys are shown below. Store your private key securely!",
    });
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.publicKey) {
      toast({
        title: "Error",
        description: "Please generate or provide a public key.",
        variant: "destructive",
      });
      return;
    }
    try {
      await signup(values.publicKey, values.username);
      toast({
        title: "Account Created!",
        description: "You've successfully signed up. You are now logged in.",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <UserPlus className="mr-2 h-6 w-6" /> Create Account
        </CardTitle>
        <CardDescription>
          Generate a new digital key pair or use an existing public key to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Button type="button" onClick={handleGenerateKeys} className="w-full mb-4" variant="outline">
              <KeyRound className="mr-2 h-4 w-4" /> Generate New Key Pair (Mock)
            </Button>

            {generatedKeys && showPrivateKey && (
                 <div className="p-3 my-2 border border-yellow-500 bg-yellow-50 rounded-md text-sm">
                    <p className="font-semibold text-yellow-700">Save your Private Key securely!</p>
                    <p className="text-yellow-600 break-all">Private Key: <span className="font-mono">{generatedKeys.privateKey}</span></p>
                    <p className="mt-1 text-xs text-yellow-500">This is for demonstration. In a real app, the private key is never shown like this after generation by client-side crypto tools and is NEVER sent to the server.</p>
                    <Button type="button" variant="link" size="sm" className="text-yellow-700 p-0 h-auto mt-1" onClick={() => setShowPrivateKey(false)}>Hide Private Key</Button>
                </div>
            )}
            
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Your public key" {...field} readOnly={!!generatedKeys} />
                  </FormControl>
                  <FormDescription>
                    This is your unique public identifier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={authLoading || !form.formState.isValid || !form.getValues("publicKey")}>
              {authLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
         <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
      </CardFooter>
    </Card>
  );
}
