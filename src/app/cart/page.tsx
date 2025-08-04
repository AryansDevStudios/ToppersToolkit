'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlaceOrderForm } from '@/components/PlaceOrderForm';
import Link from 'next/link';
import { Trash2, ShoppingCart, IndianRupee } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { items, removeFromCart, itemCount, totalPrice } = useCart();

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-headline mb-8 text-center">Your Cart</h1>
      {itemCount === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground/50" />
          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added any notes yet.</p>
          <Button asChild className="mt-6">
            <Link href="/">Start Browsing</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Items in Cart</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-semibold">{item.subjectName} - {item.chapter}</h3>
                                <p className="text-sm text-muted-foreground">{item.type}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-semibold flex items-center">
                                    <IndianRupee className="h-4 w-4 mr-1"/>
                                    {item.price.toFixed(2)}
                                </p>
                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Remove item</span>
                                </Button>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
                 <CardFooter className="flex flex-col items-end">
                    <Separator className="my-4" />
                    <div className="flex justify-between w-full text-lg font-semibold">
                        <span>Total</span>
                        <span className="flex items-center"><IndianRupee className="h-5 w-5 mr-1"/>{totalPrice.toFixed(2)}</span>
                    </div>
                </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <PlaceOrderForm cartItems={items} />
          </div>
        </div>
      )}
    </div>
  );
}
