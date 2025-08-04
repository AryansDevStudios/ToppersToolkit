'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { placeOrderAction } from '@/lib/actions';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const OrderFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  userClass: z.string().min(1, { message: "Class is required." }),
  instructions: z.string().optional(),
});

type OrderFormInputs = z.infer<typeof OrderFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Placing Order...' : 'Place Order'}
    </Button>
  );
}

export function PlaceOrderForm({ cartItems }: { cartItems: CartItem[] }) {
  const [state, formAction] = useFormState(placeOrderAction, { success: false, message: '' });
  const { clearCart } = useCart();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormInputs>({
    resolver: zodResolver(OrderFormSchema),
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Order Placed!',
        description: state.message,
      });
      clearCart();
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, clearCart, toast]);

  if (state.success) {
      return (
          <Card className="w-full max-w-lg mx-auto">
              <CardHeader>
                  <CardTitle>Thank You!</CardTitle>
                  <CardDescription>Your order has been placed successfully. We will contact you shortly.</CardDescription>
              </CardHeader>
          </Card>
      )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>Place Your Order</CardTitle>
            <CardDescription>Provide your details for hand-to-hand delivery.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="userClass">Class (e.g., 10th A)</Label>
                    <Input id="userClass" {...register('userClass')} />
                    {errors.userClass && <p className="text-sm text-destructive mt-1">{errors.userClass.message}</p>}
                </div>
                <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea id="instructions" {...register('instructions')} placeholder="e.g. Printed format, specific binding..." />
                </div>
                <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />
                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  );
}
