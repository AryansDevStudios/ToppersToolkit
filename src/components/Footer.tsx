
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card mt-12 border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 text-center">
          <div>
            <h3 className="text-lg font-black mb-2">Topper's Toolkit</h3>
            <p className="text-muted-foreground text-sm">Please download our new app to access all study materials.</p>
             <div className="mt-4 flex flex-col items-center gap-2">
                <Link href="/terms" className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
                    Terms & Conditions
                </Link>
            </div>
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
