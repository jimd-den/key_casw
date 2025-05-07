
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
import { KeyRound, LogInIcon, Loader2 } from "lucide-react";
import Link from "next/link";

const publicKeyRegex = /^key_pub_P256_spki_b64_[A-Za-z0-9+/=]+$/;
const formSchema = z.object({
  publicKey: z.string().regex(publicKeyRegex, "Invalid public key format. Expected 'key_pub_P256_spki_b64_...'"),
  privateKeyProof: z.string().min(1, "Proof of private key is required."), // Simplified: just type anything
});

export function LoginForm() {
  const { login, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicKey: "",
      privateKeyProof: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // In a real app, values.privateKeyProof would be a cryptographic signature
      // or a challenge-response that proves ownership of the private key associated
      // with values.publicKey. Here, it's just a non-empty string.
      await login(values.publicKey, values.privateKeyProof);
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: (error as Error).message || "Invalid credentials or an unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <LogInIcon className="mr-2 h-6 w-6" /> Log In
        </CardTitle>
        <CardDescription>
          Enter your public key and simulate proving ownership of your private key to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Your public key (e.g., key_pub_P256_...)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your unique public identifier generated during signup.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateKeyProof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Key Proof (Simulation)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter any text to simulate proof" {...field} />
                  </FormControl>
                  <FormDescription>
                    This step simulates cryptographic proof. In a real app, you would use your saved private key to sign a challenge, not type the key itself. For this demo, type any text (e.g., the private key string you saved, or simply "password").
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={authLoading || !form.formState.isValid}>
             {authLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging In...</>) : "Log In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
      </CardFooter>
    </Card>
  );
}
