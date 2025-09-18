
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Smartphone } from 'lucide-react';

export default function DownloadPage() {
  const APK_URL = "https://github.com/AryansDevStudios/ToppersToolkitE-Materials/raw/refs/heads/main/app/android/Topper's%20Toolkit%201.4.0.apk";

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-250px)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Smartphone className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">We've Moved to a New App!</CardTitle>
          <CardDescription>
            To continue accessing Topper's Toolkit, please download our new and improved Android application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <a href={APK_URL}>
              <Download className="mr-2 h-5 w-5" />
              Download the App
            </a>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Version 1.4.0 for Android
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
