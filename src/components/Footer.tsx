import { Send, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8.8c0-.9-.7-1.7-1.5-1.7s-1.5.8-1.5 1.7c0 .9.7 1.7 1.5 1.7s1.5-.8 1.5-1.7z"></path>
        <path d="M8 8.8c0-.9-.7-1.7-1.5-1.7S5 8 5 8.8c0 .9.7 1.7 1.5 1.7S8 9.7 8 8.8z"></path>
        <path d="M15.5 14h-7c-1.4 0-2.5 1.1-2.5 2.5v1c0 .8.7 1.5 1.5 1.5h6c.8 0 1.5-.7 1.5-1.5v-1c0-1.4-1.1-2.5-2.5-2.5z"></path>
        <path d="M18.2 12.3c.9-.4 1.5-1.3 1.5-2.3 0-1.4-1.1-2.5-2.5-2.5-1.2 0-2.2.9-2.4 2.1"></path>
        <path d="M5.8 12.3c-.9-.4-1.5-1.3-1.5-2.3 0-1.4 1.1-2.5 2.5-2.5 1.2 0 2.2.9 2.4 2.1"></path>
    </svg>
)

export function Footer() {
  return (
    <footer className="bg-card mt-12 border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
           <div>
            <h3 className="text-lg font-semibold font-headline mb-2">Download Our App</h3>
            <p className="text-muted-foreground mb-4">Get the full experience on your Android device.</p>
            <Button asChild>
              <Link href="#">
                <AndroidIcon className="mr-2 h-5 w-5" />
                Download for Android
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Topper's Toolkit. All rights reserved.</p>
          <p>Products by Kuldeep Singh</p>
          <p>Website build under AryansDevStudios</p>
        </div>
      </div>
    </footer>
  );
}
