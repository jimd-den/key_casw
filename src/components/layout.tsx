import type { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </AuthProvider>
  );
}
