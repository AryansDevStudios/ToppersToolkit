
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Topper's Toolkit - Quality School Notes",
  description: 'Your one-stop shop for chapter-wise school notes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon/icon_app.ico',
    apple: '/icon/apple-touch-icon.png',
  },
  verification: {
    google: "HhYE_EaRl3a-lakYfgYJNTwiSP22eQX_QUafQRqd0nw",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d6efd" />
      </head>
      <body className="font-body antialiased h-full flex flex-col bg-background">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
