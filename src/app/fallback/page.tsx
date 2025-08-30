
import { WifiOff } from 'lucide-react';

export default function FallbackPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <WifiOff className="h-24 w-24 text-muted-foreground/50" />
            <h1 className="mt-4 text-4xl font-bold font-headline">You are Offline</h1>
            <p className="mt-2 text-muted-foreground">
                It seems you've lost your connection. Please check your network and try again.
            </p>
        </div>
    )
}
