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
import { KeyRound, LogInIcon } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  publicKey: z.string().min(10, "Public key seems too short."),
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
          Enter your public key and prove ownership of your private key to log in.
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
                    <Input placeholder="Your public key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your unique public identifier.
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
                  <FormLabel>Private Key Proof (Mock)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your private key (simulation)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Simulate proving you control the private key. In a real app, this would involve a cryptographic challenge, not typing your private key. For this demo, type your mock private key if you remember it from signup, or any text.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={authLoading || !form.formState.isValid}>
             {authLoading ? "Logging In..." : "Log In"}
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
