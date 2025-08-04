import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';
import { format } from 'date-fns';

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Orders Yet</CardTitle>
                    <CardDescription>New orders will appear here as they are placed.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{order.name}</CardTitle>
                <CardDescription>Class: {order.userClass}</CardDescription>
              </div>
              <Badge variant="outline">{format(order.createdAt.toDate(), 'PPP')}</Badge>
            </div>
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
        </Card>
      ))}
    </div>
  );
}
