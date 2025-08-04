import { Instagram, Send, Smartphone } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card mt-12 border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-black font-headline mb-2">QuickNotes</h3>
            <p className="text-muted-foreground">High-quality resources for academic success.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>WhatsApp: +91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span>Telegram: @quicknotes</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span>Instagram: @quicknotes_official</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} QuickNotes. All rights reserved. Built with passion.
        </div>
      </div>
    </footer>
  );
}
