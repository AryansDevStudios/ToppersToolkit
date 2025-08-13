
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { completeOrderAction } from '@/lib/actions';
import { useTransition, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { IndianRupee, HandCoins, QrCode, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


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
                <CardHeader>
                    <CardTitle>No Active Orders</CardTitle>
                    <CardDescription>New orders will appear here. Completed orders are hidden.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Active Orders</CardTitle>
            <CardDescription>Manage and fulfill incoming orders.</CardDescription>
        </CardHeader>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activeOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.name}</div>
                            <div className="text-sm text-muted-foreground">{order.userClass}</div>
                        </TableCell>
                        <TableCell>
                           <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-sm underline decoration-dashed cursor-pointer">
                                            {order.items.length} item{order.items.length === 1 ? '' : 's'}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            {order.items.map((item, index) => (
                                            <li key={index}>
                                                {item.subjectName} - {item.chapter} ({item.type} - {item.selectedFormat})
                                            </li>
                                            ))}
                                        </ul>
                                         {order.instructions && (
                                            <div className="mt-2 pt-2 border-t">
                                                <p className="text-xs italic">"{order.instructions}"</p>
                                            </div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className="text-xs text-muted-foreground mt-1">
                                {isClient ? `${format(new Date(order.createdAt), 'PPP p')}` : ''}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                             <div className="font-semibold flex items-center justify-end">
                                <IndianRupee className="h-4 w-4 mr-1"/>
                                {order.totalPrice.toFixed(2)}
                             </div>
                             <div className="flex items-center justify-end text-xs text-muted-foreground mt-1 gap-1.5">
                                {order.paymentMethod === 'COD' ? <HandCoins className="h-3 w-3" /> : <QrCode className="h-3 w-3" />}
                                <span>{order.paymentMethod}</span>
                             </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant={order.status === 'new' ? 'destructive' : 'secondary'}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button 
                                size="sm"
                                onClick={() => handleCompleteOrder(order.id)}
                                disabled={isPending}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isPending ? 'Completing...' : 'Complete'}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Card>
  );
}
