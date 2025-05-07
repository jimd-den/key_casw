import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeySquare, PlusSquare, Search } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-4">
        <KeySquare className="mx-auto h-24 w-24 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to Key Case
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Unravel intriguing mysteries using your unique digital identity. Create your own cases or put your detective skills to the test.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8 w-full max-w-4xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Search className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="text-2xl">Solve a Mystery</CardTitle>
            <CardDescription>
              Browse through available cases and test your detective skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mysteries" passHref legacyBehavior>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" /> View Cases
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <PlusSquare className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="text-2xl">Create a Case</CardTitle>
            <CardDescription>
              Craft your own intricate mystery for others to solve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create-case" passHref legacyBehavior>
              <Button className="w-full">
                <PlusSquare className="mr-2 h-4 w-4" /> Create New Case
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <KeySquare className="h-10 w-10 text-accent mb-2" />
            <CardTitle className="text-2xl">Your Digital Key</CardTitle>
            <CardDescription>
              Manage your secure account powered by digital key pairs.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/profile" passHref legacyBehavior>
              <Button className="w-full" variant="outline">
                <KeySquare className="mr-2 h-4 w-4" /> My Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8 p-6 bg-card rounded-lg shadow-md max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p className="text-muted-foreground">
          Key Case uses a simplified concept of key-based identity. Create an account to get your "digital key" (a unique identifier). Use this key to create and solve cases. Your identity is your key!
        </p>
      </div>
    </div>
  );
}
