
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Lottie from 'lottie-react';

import { placeOrderAction } from '@/lib/actions';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/types';
import * as tickAnimation from '@/lib/tick-animation.json';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

const OrderFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  userClass: z.string().min(1, { message: "Class is required." }),
  instructions: z.string().optional(),
});

type OrderFormInputs = z.infer<typeof OrderFormSchema>;

function SubmitButton() {
  const { formState: { isSubmitting } } = useFormContext();
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFormInputs>({
    resolver: zodResolver(OrderFormSchema),
  });

  useEffect(() => {
    if (state.success) {
      clearCart();
      reset();
      formRef.current?.reset();
    } else if (state.message && !state.success) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, clearCart, toast, reset]);

  if (state.success) {
      return (
        <Card className="w-full max-w-lg mx-auto bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="text-center">
                <div className="w-40 h-40 mx-auto">
                    <Lottie animationData={tickAnimation} loop={false} />
                </div>
                <CardTitle className="text-2xl text-green-900 dark:text-green-200">Order Placed Successfully!</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-400">
                    Thank you for your purchase. We will contact you shortly to confirm the details.
                </CardDescription>
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
             <form
              ref={formRef}
              action={formAction}
              className="space-y-4"
            >
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
                <Button type="submit" disabled={false} className="w-full">
                    Place Order
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
