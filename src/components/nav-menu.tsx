"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, Search, User as UserIcon, LogIn, LogOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/mysteries', label: 'Solve Mystery', icon: Search, requiresAuth: false },
  { href: '/create-case', label: 'Create Case', icon: PlusSquare, requiresAuth: true },
];

export function NavMenu() {
  const pathname = usePathname();
  const { currentUser, logout, isLoading } = useAuth();

  return (
    <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
      {navItems.map((item) => {
        if (item.requiresAuth && !currentUser) return null;
        return (
          <Link key={item.href} href={item.href} legacyBehavior passHref>
            <Button
              variant="ghost"
              className={cn(
                "px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium",
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
              )}
            >
              <item.icon className="mr-0 h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
      <div className="flex items-center">
        {isLoading ? (
          <Button variant="ghost" size="icon" disabled>
            <FileText className="h-5 w-5 animate-pulse" />
          </Button>
        ) : currentUser ? (
          <>
            <Link href="/profile" legacyBehavior passHref>
              <Button variant="ghost" className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium">
                <UserIcon className="mr-0 h-5 w-5 sm:mr-2" />
                 <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium">
              <LogOut className="mr-0 h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        ) : (
          <Link href="/auth/login" legacyBehavior passHref>
            <Button variant="ghost" className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium">
              <LogIn className="mr-0 h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
