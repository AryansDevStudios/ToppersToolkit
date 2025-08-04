'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { completeOrderAction } from '@/lib/actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleCompleteOrder = (orderId: string) => {
        startTransition(async () => {
            const result = await completeOrderAction(orderId);
            if (result.success) {
                toast({ title: 'Success', description: result.message });
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
    <div className="space-y-4">
      {activeOrders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{order.name}</CardTitle>
                <CardDescription>Class: {order.userClass}</CardDescription>
              </div>
              <Badge variant={order.status === 'new' ? 'destructive' : 'secondary'}>{order.status}</Badge>
            </div>
             <p className="text-sm text-muted-foreground pt-2">{format(new Date(order.createdAt), 'PPP')}</p>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold mb-2">Ordered Items:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.subjectName} - {item.chapter} ({item.type})
                  </li>
                ))}
              </ul>
            </div>
            {order.instructions && (
              <div className="mt-4">
                <h4 className="font-semibold">Special Instructions:</h4>
                <p className="text-sm text-muted-foreground italic">"{order.instructions}"</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
                onClick={() => handleCompleteOrder(order.id)}
                disabled={isPending}
            >
                {isPending ? 'Completing...' : 'Mark as Completed'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
