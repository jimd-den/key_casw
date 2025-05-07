import Link from 'next/link';
import { NavMenu } from './nav-menu';
import { KeySquare } from 'lucide-react'; // Using KeySquare as a thematic icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" legacyBehavior passHref>
          <a className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            <KeySquare className="h-7 w-7" />
            <span>Key Case</span>
          </a>
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
