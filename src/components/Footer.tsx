import { Send, Smartphone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card mt-12 border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-black font-headline mb-2">Topper's Toolkit</h3>
            <p className="text-muted-foreground">High-quality resources for academic success.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <a href="https://wa.me/917754000411" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  WhatsApp: +91 77540 00411
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                 <a href="https://t.me/topperstoolkit" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  Telegram: @topperstoolkit
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Topper's Toolkit. All rights reserved. Built by AryansDevStudios.</p>
          <p className="mt-2">Sold by Kuldeep Singh</p>
        </div>
      </div>
    </footer>
  );
}
