'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { getSubjects } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { Subject } from '@/types';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { itemCount } = useCart();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    getSubjects().then(setSubjects);
  }, []);

  const navLinks = (
    <>
      <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
        Home
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-auto text-muted-foreground transition-colors hover:text-foreground hover:bg-transparent">Browse</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.id}`} passHref>
              <DropdownMenuItem>{subject.name}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
        Admin
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://raw.githubusercontent.com/AryansDevStudios/ToppersToolkit/main/icon/icon_app_128x128.png" alt="Topper's Toolkit Logo" className="h-8 w-8 rounded-lg" />
            <span className="font-black text-lg font-headline">Topper's Toolkit</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                   <SheetTitle>
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://raw.githubusercontent.com/AryansDevStudios/ToppersToolkit/main/icon/icon_app_128x128.png" alt="Topper's Toolkit Logo" className="h-8 w-8 rounded-lg" />
                      <span className="font-bold font-headline">Topper's Toolkit</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
           <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* Future Search Bar can go here */}
          </div>
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs">{itemCount}</Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
