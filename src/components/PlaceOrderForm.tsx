
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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
import { useForm } from 'react-hook-form';

const OrderFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  userClass: z.string().min(1, { message: "Class is required." }),
  instructions: z.string().optional(),
  paymentMethod: z.enum(['COD', 'UPI'], { required_error: 'Please select a payment method.' }),
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
  const [state, formAction] = useActionState(placeOrderAction, { success: false, message: '' });
  const { clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { reset, watch, setValue, formState: { errors } } = useForm<OrderFormInputs>({
    defaultValues: {
        name: '',
        userClass: '',
        instructions: '',
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
      formRef.current?.reset();
      reset();
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, clearCart, toast, reset]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText('nitish545454@ybl');
    toast({ title: 'Copied!', description: 'UPI ID copied to clipboard.'});
  };
  
  const handleFormAction = (formData: FormData) => {
     if (totalPrice === 0) {
        toast({ title: 'Error', description: 'Your cart is empty.', variant: 'destructive'});
        return;
    }
    formData.append('cartItems', JSON.stringify(cartItems));
    formAction(formData);
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
              action={handleFormAction}
              className="space-y-4"
            >
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="userClass">Class (e.g., 10th A)</Label>
                    <Input id="userClass" name="userClass" required />
                     {errors.userClass && <p className="text-sm text-destructive mt-1">{errors.userClass.message}</p>}
                </div>

                <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea id="instructions" name="instructions" placeholder="e.g. Printed format, specific binding..." />
                </div>

                 <div>
                    <Label>Payment Method</Label>
                    <RadioGroup
                        name="paymentMethod"
                        defaultValue={paymentMethod}
                        onValueChange={(val: 'COD' | 'UPI') => setValue('paymentMethod', val)}
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
            

                {paymentMethod === 'UPI' && (
                    <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertTitle>Pay with UPI</AlertTitle>
                        <AlertDescription className="space-y-4">
                            <p>Scan the QR code or use the UPI ID below to complete your payment.</p>
                            <div className="flex justify-center">
                                <img src="/images/payment_qr.png" alt="UPI QR Code" data-ai-hint="qr code" className="rounded-md" />
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-muted">
                                <span className="font-mono text-sm">nitish545454@ybl</span>
                                <Button type="button" variant="ghost" size="sm" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">After payment, please proceed with placing the order.</p>
                        </AlertDescription>
                    </Alert>
                )}

                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  );
}
