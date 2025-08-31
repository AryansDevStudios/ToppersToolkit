
'use client';

import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useEffect } from 'react';


export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Service worker registration has been removed to disable caching during development.
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
