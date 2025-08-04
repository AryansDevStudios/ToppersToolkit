'use client';

import Link from 'next/link';
import { Book, Menu, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { getSubjects } from '@/lib/data';
import { useEffect, useState } from 'react';
import type { Subject } from '@/types';
import { Badge } from './ui/badge';

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
          <Button variant="ghost" className="p-0 h-auto text-muted-foreground transition-colors hover:text-foreground hover:bg-transparent">Browse by Subject</Button>
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">QuickNotes 📘</span>
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
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Book className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">QuickNotes 📘</span>
                  </Link>
                  {navLinks}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center p-0">{itemCount}</Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
