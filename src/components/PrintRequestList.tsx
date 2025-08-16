
'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { completeOrderAction } from '@/lib/actions';
import { IndianRupee, HandCoins, QrCode, CheckCircle, Info, FileText, ExternalLink, MessageSquare } from 'lucide-react';
import { Separator } from './ui/separator';

type PrintRequestListProps = {
  orders: Order[];
  pricePerPage: number;
};

// Function to extract URL and user instructions
const parseInstructions = (text: string | undefined) => {
    if (!text) return { url: null, userInstructions: null };
    
    // Split the instructions string into lines
    const lines = text.split('\n');
    
    // Find the line that starts with 'https://wormhole.app/'
    const urlLine = lines.find(line => line.startsWith('https://wormhole.app/'));
    const url = urlLine || null;

    // The rest of the lines are user instructions
    const userInstructions = lines.filter(line => !line.startsWith('https://wormhole.app/')).join('\n').trim();

    return { url, userInstructions: userInstructions || null };
};


export function PrintRequestList({ orders, pricePerPage }: PrintRequestListProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCompleteOrder = (orderId: string) => {
        startTransition(async () => {
            const result = await completeOrderAction(orderId);
            if (result.success) {
                toast({ title: 'Success', description: result.message });
                router.refresh();
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        });
    };

    const activeOrders = orders.filter(order => order.status !== 'completed');

    if (activeOrders.length === 0) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>No Active Print Requests</CardTitle>
                    <CardDescription>New print requests will appear here.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Active Print Requests</CardTitle>
            <CardDescription>Manage and fulfill custom print orders.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => {
                const { url, userInstructions } = parseInstructions(order.instructions);
                const contactHref = order.whatsappNumber 
                  ? `https://wa.me/91${order.whatsappNumber.replace(/\D/g, '')}`
                  : `https://wa.me/917754000411`; // Fallback to default number

                return (
                    <Card key={order.id} className="flex flex-col bg-muted/20">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{order.name}</CardTitle>
                                    <CardDescription>{order.userClass}</CardDescription>
                                    {order.whatsappNumber && (
                                        <a href={contactHref} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {order.whatsappNumber}
                                        </a>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isClient ? `${format(new Date(order.createdAt), 'PPP p')}` : ''}
                                    </p>
                                </div>
                                <Badge variant={order.status === 'new' ? 'destructive' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            {url && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Files to Print</h4>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline underline-offset-2 break-all flex items-center gap-1">
                                      {url} <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                    </a>
                                </div>
                            )}
                            
                            {userInstructions && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        User Instructions
                                    </h4>
                                    <p className="text-sm text-muted-foreground italic border-l-2 pl-3 whitespace-pre-wrap">"{userInstructions}"</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch space-y-3 bg-background border-t">
                             <Separator />
                             <div className="flex justify-between items-center">
                                <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                                    {order.paymentMethod === 'COD' ? <HandCoins className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                                    <span>{order.paymentMethod}</span>
                                </div>
                                <div className="font-semibold text-lg flex flex-col items-end">
                                    <span>To be confirmed</span>
                                    <span className="text-xs text-muted-foreground">(₹{pricePerPage.toFixed(2)} / page)</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button asChild size="sm" variant="secondary" className="w-full">
                                    <a href={contactHref} target="_blank" rel="noopener noreferrer">
                                        <MessageSquare className="mr-2 h-4 w-4"/> Contact User
                                    </a>
                                </Button>
                                 <Button 
                                    size="sm"
                                    onClick={() => handleCompleteOrder(order.id)}
                                    disabled={isPending}
                                    className="w-full"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isPending ? 'Completing...' : 'Mark as Done'}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                )
            })}
        </CardContent>
    </Card>
  );
}
