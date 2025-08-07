
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QrCode, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OrderFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  userClass: z.string().min(1, { message: "Class is required." }),
  instructions: z.string().optional(),
  paymentMethod: z.enum(['COD', 'UPI'], { required_error: 'Please select a payment method.' }),
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
  const { clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<OrderFormInputs>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
        paymentMethod: 'COD'
    }
  });

  const paymentMethod = watch('paymentMethod');
  
  useEffect(() => {
    if (state.success) {
      toast({
          title: "Order Placed!",
          description: state.message,
      });
      clearCart();
      reset();
      setIsSubmitting(false);
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }, [state, clearCart, toast, reset]);

  const onFormSubmit = (data: OrderFormInputs) => {
    if (totalPrice === 0) {
        toast({ title: 'Error', description: 'Your cart is empty.', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('userClass', data.userClass);
    formData.append('paymentMethod', data.paymentMethod);
    if(data.instructions) formData.append('instructions', data.instructions);
    formData.append('cartItems', JSON.stringify(cartItems));

    formAction(formData);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText('kuldeepsingh-okaxis@pay.co');
    toast({ title: 'Copied!', description: 'UPI ID copied to clipboard.'});
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>Place Your Order</CardTitle>
            <CardDescription>Provide your details for hand-to-hand delivery.</CardDescription>
        </CardHeader>
        <CardContent>
             <form
              ref={formRef}
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-4"
            >
                <input type="hidden" name="cartItems" value={JSON.stringify(cartItems)} />
                 <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...field} />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                    )}
                 />
                 <Controller
                    name="userClass"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label htmlFor="userClass">Class (e.g., 10th A)</Label>
                            <Input id="userClass" {...field} />
                            {errors.userClass && <p className="text-sm text-destructive mt-1">{errors.userClass.message}</p>}
                        </div>
                    )}
                 />
                 <Controller
                    name="instructions"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label htmlFor="instructions">Special Instructions</Label>
                            <Textarea id="instructions" {...field} placeholder="e.g. Printed format, specific binding..." />
                        </div>
                    )}
                 />

                <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                         <div>
                            <Label>Payment Method</Label>
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex gap-4 pt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="COD" id="cod" />
                                    <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="UPI" id="upi" />
                                    <Label htmlFor="upi">UPI</Label>
                                </div>
                            </RadioGroup>
                            {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
                        </div>
                    )}
                />

                {paymentMethod === 'UPI' && (
                    <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertTitle>Pay with UPI</AlertTitle>
                        <AlertDescription className="space-y-4">
                            <p>Scan the QR code or use the UPI ID below to complete your payment.</p>
                            <div className="flex justify-center">
                                <img src="https://placehold.co/200x200.png" alt="UPI QR Code" data-ai-hint="qr code" className="rounded-md" />
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted">
                                <span className="font-mono text-sm">kuldeepsingh-okaxis@pay.co</span>
                                <Button type="button" variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">After payment, please proceed with placing the order.</p>
                        </AlertDescription>
                    </Alert>
                )}

                <SubmitButton isSubmitting={isSubmitting} />
            </form>
        </CardContent>
    </Card>
  );
}
