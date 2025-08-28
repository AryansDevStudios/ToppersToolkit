
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ExternalLink } from 'lucide-react';
import type { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const SELLER_WHATSAPP_NUMBER = '7754000411';

function ConfirmationPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);
    const [order, setOrder] = useState<Omit<Order, 'id' | 'createdAt' | 'status'> | null>(null);
    const [isPrintRequest, setIsPrintRequest] = useState(false);
    const [whatsAppUrl, setWhatsAppUrl] = useState('');

    useEffect(() => {
        const orderData = searchParams.get('order');
        const printRequest = searchParams.get('isPrintRequest');
        if (orderData) {
            try {
                const parsedOrder = JSON.parse(orderData);
                setOrder(parsedOrder);
                setIsPrintRequest(printRequest === 'true');
            } catch (e) {
                console.error("Failed to parse order data", e);
                router.push('/');
            }
        } else {
             router.push('/');
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (!order) return;

        const generateWhatsAppMessage = () => {
            const customerName = order.name;
            const customerClass = order.userClass;
            const customerWhatsapp = order.whatsappNumber || 'N/A';
            const totalPrice = isPrintRequest ? 'To be confirmed' : `₹${order.totalPrice.toFixed(2)}`;
            const paymentMode = order.paymentMethod;

            let itemsList = '';
            let specialInstructions = '';

            if (isPrintRequest) {
                const { url, userInstructions } = parseInstructions(order.instructions);
                itemsList = `Custom Print Request: ${url || 'Link not provided'}`;
                specialInstructions = userInstructions || 'None';
            } else {
                itemsList = order.items.map((item, index) =>
                    `${index + 1}. ${item.type} - ${item.chapter}\n` +
                    `   Subject: ${item.subjectName}\n` +
                    `   Format: ${item.selectedFormat}\n` +
                    `   Price: ${item.price === 0 ? 'Free' : `₹${item.price.toFixed(2)}`}`
                ).join('\n\n');
                specialInstructions = order.instructions || 'None';
            }

            const messageTemplate = `Hello Kuldeep! You got a new order from Topper's Toolkit Shop.

Customer Details:
Name: ${customerName}
Class: ${customerClass}
WhatsApp: wa.me/${customerWhatsapp.replace(/\D/g, '')}
Special Instructions: ${specialInstructions}

Here are the ordered materials:
${itemsList}

Total price: ${totalPrice}
Payment mode: ${paymentMode}

Note: This message can be edited or changed. Please visit https://topperstoolkit.netlify.app/admin for viewing verified details.`;

            return messageTemplate;
        };

        const message = generateWhatsAppMessage();
        setWhatsAppUrl(`https://wa.me/${SELLER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);

    }, [order, isPrintRequest]);

    useEffect(() => {
        if (!whatsAppUrl) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown === 0) {
            clearInterval(timer);
            window.location.href = whatsAppUrl;
        }

        return () => clearInterval(timer);
    }, [countdown, whatsAppUrl]);

    const handleOpenWhatsApp = () => {
        if (whatsAppUrl) {
            window.location.href = whatsAppUrl;
        }
    };
    
    const parseInstructions = (text: string | undefined) => {
        if (!text) return { url: null, userInstructions: null };
        const lines = text.split('\n');
        const urlLine = lines.find(line => line.startsWith('https://wormhole.app/'));
        const url = urlLine || null;
        const userInstructions = lines.filter(line => !line.startsWith('https://wormhole.app/')).join('\n').trim();
        return { url, userInstructions: userInstructions || null };
    };

    if (!order) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-48 mx-auto mt-4" />
                        <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-48 mx-auto" />
                        <Skeleton className="h-12 w-24 mx-auto" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] container">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="mt-4">Order Confirmed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-left bg-muted/50 p-4 rounded-lg">
                        <p className="font-bold">What's Next?</p>
                        <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-muted-foreground">
                            <li>You will be redirected to WhatsApp in a moment.</li>
                            <li>A message with your order details will be pre-filled.</li>
                            <li><strong className="text-foreground">Please do not edit the message.</strong></li>
                            <li>Simply press the <strong className="text-foreground">Send</strong> button to finalize your order with the seller.</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Redirecting to WhatsApp in...</p>
                        <p className="text-4xl font-bold">{countdown}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleOpenWhatsApp}>
                            Send on WhatsApp Now
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/')}>
                            Go to Homepage
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationPageContent />
        </Suspense>
    )
}
