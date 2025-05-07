
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
import { KeyRound, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const publicKeyRegex = /^key_pub_P256_spki_b64_[A-Za-z0-9+/=]+$/;
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").optional().or(z.literal("")),
  publicKey: z.string().regex(publicKeyRegex, "Invalid public key format. Expected 'key_pub_P256_spki_b64_...' followed by Base64 string."),
});

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function SignupForm() {
  const { signup, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [generatedKeys, setGeneratedKeys] = useState<{publicKey: string, privateKey: string} | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      publicKey: "",
    },
  });

  useEffect(() => {
    if (generatedKeys) {
      form.setValue("publicKey", generatedKeys.publicKey, { shouldValidate: true });
    }
  }, [generatedKeys, form]);

  const handleGenerateKeys = async () => {
    setIsGeneratingKeys(true);
    setShowPrivateKey(false);
    setGeneratedKeys(null);
    form.resetField("publicKey");

    if (typeof window.crypto === 'undefined' || typeof window.crypto.subtle === 'undefined') {
        toast({
            title: "Error",
            description: "Web Crypto API is not available in your browser. Cannot generate keys.",
            variant: "destructive",
        });
        setIsGeneratingKeys(false);
        return;
    }

    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256', // NIST P-256
        },
        true, // key is extractable
        ['sign', 'verify'] // key can be used for signing and verification
      );

      // Export public key in SPKI format, then Base64 encode
      const publicKeyDer = await window.crypto.subtle.exportKey(
        'spki',
        keyPair.publicKey
      );
      const publicKeyBase64 = arrayBufferToBase64(publicKeyDer);

      // Export private key in PKCS8 format, then Base64 encode (for user to save)
      const privateKeyDer = await window.crypto.subtle.exportKey(
        'pkcs8',
        keyPair.privateKey
      );
      const privateKeyBase64 = arrayBufferToBase64(privateKeyDer);
      
      const newKeys = {
        publicKey: `key_pub_P256_spki_b64_${publicKeyBase64}`,
        privateKey: `key_priv_P256_pkcs8_b64_${privateKeyBase64}`,
      };

      setGeneratedKeys(newKeys);
      setShowPrivateKey(true); 
      toast({
        title: "Secure Keys Generated!",
        description: "Your new public and private keys are shown below. Store your PRIVATE KEY in a very safe place. If you lose it, you lose access. The app will NOT store it.",
        duration: 10000,
      });
    } catch (error) {
      console.error("Key generation error:", error);
      toast({
        title: "Key Generation Failed",
        description: "Could not generate keys. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.publicKey) { // Should be caught by zod, but as a safeguard
      toast({
        title: "Error",
        description: "Public key is missing. Please generate or provide one.",
        variant: "destructive",
      });
      return;
    }
    try {
      await signup(values.publicKey, values.username || undefined); // Pass undefined if username is empty string
      toast({
        title: "Account Created!",
        description: "You've successfully signed up and are now logged in.",
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
          Generate a new secure digital key pair for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Button 
              type="button" 
              onClick={handleGenerateKeys} 
              className="w-full mb-4" 
              variant="outline"
              disabled={isGeneratingKeys}
            >
              {isGeneratingKeys ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              {isGeneratingKeys ? "Generating Keys..." : "Generate New Secure Key Pair"}
            </Button>

            {generatedKeys && showPrivateKey && (
                 <Card className="p-4 my-2 border-destructive bg-destructive/10">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-lg flex items-center text-destructive">
                            <ShieldAlert className="mr-2 h-5 w-5"/>IMPORTANT: Save Your Private Key!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm space-y-2">
                        <p className="text-destructive-foreground font-semibold">
                            This is your ONLY chance to save your private key. It grants full access to your account.
                        </p>
                        <div className="p-2 bg-background rounded-md border border-input">
                            <p className="font-semibold">Private Key:</p>
                            <p className="text-xs break-all font-mono select-all">{generatedKeys.privateKey}</p>
                        </div>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                            <li>Store it in a password manager or a secure, offline location.</li>
                            <li>DO NOT share it with anyone.</li>
                            <li>If you lose it, you cannot recover your account.</li>
                        </ul>
                         <Button type="button" variant="link" size="sm" className="text-destructive p-0 h-auto mt-2 hover:underline" onClick={() => setShowPrivateKey(false)}>I've saved it, hide Private Key</Button>
                    </CardContent>
                </Card>
            )}
            
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Generated automatically or paste existing" {...field} readOnly={!!generatedKeys} />
                  </FormControl>
                  <FormDescription>
                    Your unique public identifier. (Format: key_pub_P256_spki_b64_...)
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
                  <FormDescription>This will be your display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={authLoading || isGeneratingKeys || !form.formState.isValid || !form.getValues("publicKey")}>
              {authLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</>) : "Sign Up"}
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
