
import { Mail, Send, Smartphone, Download, BookUser } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-card mt-12 border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-black mb-2">Topper's Toolkit</h3>
            <p className="text-muted-foreground text-sm">This site is for ordering notes. Purchased digital materials can be viewed on our <a href="https://topperstoolkitviewer.netlify.app/" className="text-primary hover:underline">Library platform</a>.</p>
             <div className="mt-4 flex flex-col items-center md:items-start gap-2">
                <Link href="/terms" className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
                    Terms & Conditions
                </Link>
                <Link href="/manual" className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
                    User Manual
                </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                 <Mail className="h-4 w-4" />
                 <a href="mailto:kuldeepsingh012011@gmail.com" className="hover:text-primary">
                    kuldeepsingh012011@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Smartphone className="h-4 w-4" />
                <a href="https://wa.me/917754000411" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  WhatsApp: +91 77540 00411
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Send className="h-4 w-4" />
                 <a href="https://t.me/topperstoolkit" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  Telegram: @topperstoolkit
                </a>
              </li>
            </ul>
          </div>
           <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Download App</h3>
            <p className="text-muted-foreground text-sm mb-4">Get the Android app for a better mobile experience.</p>
            <Button asChild>
                <a href="https://github.com/AryansDevStudios/ToppersToolkit/raw/main/public/app/android/Topper's%20Toolkit.apk" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download APK
                </a>
            </Button>
          </div>
        </div>
          <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Topper's Toolkit Viewer. Products by Kuldeep Singh.</p>
          <p className="sm:mb-0 mb-16 inline-block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Website built under AryansDevStudios.</p>
        </div>
      </div>
    </footer>
  );
}
