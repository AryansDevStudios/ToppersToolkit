
'use client';

import { useActionState, useEffect, useRef } from 'react';
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

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </Button>
    );
}

export function PlaceOrderForm({ cartItems }: { cartItems: CartItem[] }) {
  const [state, formAction] = useActionState(placeOrderAction, { success: false, message: '' });
  const { clearCart } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<OrderFormInputs>({
    resolver: zodResolver(OrderFormSchema),
  });
  
  useEffect(() => {
    if (state.success) {
        toast({
            title: "Order Placed!",
            description: state.message,
        });
      clearCart();
      reset();
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, clearCart, toast, reset]);
  
  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>Place Your Order</CardTitle>
            <CardDescription>Provide your details for hand-to-hand delivery.</CardDescription>
        </CardHeader>
        <CardContent>
             <form
              ref={formRef}
              action={formAction}
              className="space-y-4"
            >
                <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />
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
                <SubmitButton isSubmitting={isSubmitting} />
            </form>
        </CardContent>
    </Card>
  );
}
