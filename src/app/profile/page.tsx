"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { KeyRound, UserCircle, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { currentUser, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/auth/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
             <Skeleton className="h-10 w-1/4 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UserCircle className="mr-2 h-7 w-7 text-primary" />
            Account Information
          </CardTitle>
          <CardDescription>
            Here are your account details associated with your digital key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUser.username && (
            <div className="flex items-center space-x-3">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <p>
                <strong>Username:</strong> {currentUser.username}
              </p>
            </div>
          )}
          <div className="flex items-start space-x-3">
            <KeyRound className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <p className="font-semibold">Public Key:</p>
              <p className="text-sm text-muted-foreground break-all font-mono bg-secondary p-2 rounded-md">
                {currentUser.publicKey}
              </p>
            </div>
          </div>
           <Button onClick={logout} variant="destructive" className="mt-4">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Your Activity (Placeholder)</CardTitle>
          <CardDescription>Cases created or solved by you.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activity to display yet.</p>
          {/* Future: List created cases, solved cases, etc. */}
        </CardContent>
      </Card>
    </div>
  );
}
