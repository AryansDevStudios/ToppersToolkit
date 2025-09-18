
'use client';

import Link from 'next/link';
import { Home, UserCog } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';

export function Header() {

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Image src="/icon/icon_main.png" alt="Topper's Toolkit Logo" width={32} height={32} />
            <span className="font-black text-lg font-headline">Topper's Toolkit</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
             <Link href="/admin" className="transition-colors hover:text-foreground">
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header is combined with Desktop as there's no nav anymore */}
    </>
  );
}
