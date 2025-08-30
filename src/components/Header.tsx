
'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Search, Printer, Library as LibraryIcon, UserCog } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from './ui/badge';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#subjects', label: 'Browse', icon: Search },
  { href: '/print', label: 'Print', icon: Printer },
  { href: 'https://topperstoolkitviewer.netlify.app/', label: 'Library', icon: LibraryIcon },
];

export function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Image src="/icon/icon_main.png" alt="Topper's Toolkit Logo" width={32} height={32} />
            <span className="font-black text-lg font-headline">Topper's Toolkit</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  item.href === '/' && pathname === item.href && 'text-foreground',
                  item.href !== '/' && pathname.startsWith(item.href) && 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
             <Link href="/admin" className="transition-colors hover:text-foreground">
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Admin</span>
            </Link>
            <Link href="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">{itemCount}</Badge>
                )}
                <span className="sr-only">Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
       <header className="md:hidden sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-16 items-center justify-between">
           <Link href="/" className="flex items-center space-x-2">
             <Image src="/icon/icon_main.png" alt="Topper's Toolkit Logo" width={32} height={32} />
            <span className="font-bold font-headline">Topper's Toolkit</span>
           </Link>
           <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin">
              <UserCog className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Link>
           </div>
         </div>
      </header>


      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur">
        <div className="container grid h-16 max-w-lg grid-cols-5 items-center">
            {navItems.map((item) => {
              const isActive = (item.href === '/' && pathname === item.href) || (item.label !== 'Home' && item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground"
                >
                  <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
                  <span className={cn(isActive && "text-primary")}>{item.label}</span>
                </Link>
              );
            })}
           <Link href="/cart" className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground relative">
              <ShoppingCart className={cn("h-6 w-6", pathname === '/cart' && 'text-primary')} />
              <span className={cn(pathname === '/cart' && 'text-primary')}>Cart</span>
               {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute top-0 right-3 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">{itemCount}</Badge>
                )}
           </Link>
        </div>
      </nav>
      
      {/* Spacer for bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
