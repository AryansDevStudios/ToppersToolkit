
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
import { IndianRupee, HandCoins, QrCode, CheckCircle, Info } from 'lucide-react';
import { Separator } from './ui/separator';

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
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
                    <CardTitle>No Active Note Orders</CardTitle>
                    <CardDescription>New note orders will appear here. Completed orders are hidden.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Active Note Orders</CardTitle>
            <CardDescription>Manage and fulfill incoming orders for notes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
                <Card key={order.id} className="flex flex-col bg-muted/20">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{order.name}</CardTitle>
                                <CardDescription>{order.userClass}</CardDescription>
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
                       <div>
                            <h4 className="text-sm font-semibold mb-2">Items</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.subjectName} - {item.chapter} <span className="text-xs">({item.type} - {item.selectedFormat})</span>
                                </li>
                                ))}
                            </ul>
                       </div>

                        {order.instructions && (
                            <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Instructions
                                </h4>
                                <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{order.instructions}"</p>
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
                            <div className="font-bold text-xl flex items-center justify-end">
                                <IndianRupee className="h-5 w-5 mr-1"/>
                                {order.totalPrice.toFixed(2)}
                             </div>
                        </div>
                         <Button 
                            size="sm"
                            className="w-full"
                            onClick={() => handleCompleteOrder(order.id)}
                            disabled={isPending}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isPending ? 'Completing...' : 'Mark as Completed'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </CardContent>
    </Card>
  );
}
