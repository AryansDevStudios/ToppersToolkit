
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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
import { QrCode, Copy, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';


function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending || disabled} className="w-full">
        {pending ? 'Placing Order...' : 'Place Order'}
      </Button>
    );
}

export function PlaceOrderForm({ cartItems }: { cartItems: CartItem[] }) {
  const [state, formAction] = useActionState(placeOrderAction, { success: false, message: '' });
  const { clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast({
          title: "Order Placed!",
          description: state.message,
      });
      clearCart();
      formRef.current?.reset();
      setPaymentMethod('COD');
      setAgreedToTerms(false);
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, clearCart, toast]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText('nitish545454@ybl');
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
              action={(formData) => {
                if (totalPrice === 0) {
                    toast({ title: 'Error', description: 'Your cart is empty.', variant: 'destructive'});
                    return;
                }
                formData.append('cartItems', JSON.stringify(cartItems));
                formAction(formData);
              }}
              className="space-y-4"
            >
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required minLength={2} />
                </div>
                <div>
                    <Label htmlFor="userClass">Class (e.g., 10th A)</Label>
                    <Input id="userClass" name="userClass" required />
                </div>
                 <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <div className="relative mt-1">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="whatsappNumber" name="whatsappNumber" type="tel" placeholder="e.g., 9876543210" className="pl-10" required />
                    </div>
                </div>

                <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea id="instructions" name="instructions" placeholder="e.g. Printed format, specific binding..." />
                </div>

                 <div>
                    <Label>Payment Method</Label>
                     <RadioGroup
                        name="paymentMethod"
                        value={paymentMethod}
                        onValueChange={(val: 'COD' | 'UPI') => setPaymentMethod(val)}
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
                </div>
            

                {paymentMethod === 'UPI' && (
                    <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertTitle>Pay with UPI</AlertTitle>
                        <AlertDescription className="space-y-4">
                            <p>Scan the QR code or use the UPI ID below to complete your payment.</p>
                             <div className="flex justify-center">
                                <img src="/images/payment_qr.png" alt="UPI QR Code" data-ai-hint="qr code" className="rounded-md w-48 h-48 object-contain" />
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

                <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                        id="terms"
                        name="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-normal">
                        I have read and agree to the 
                        <Link href="/terms" target="_blank" className="text-primary hover:underline underline-offset-2 ml-1">
                            Terms and Conditions
                        </Link>
                        .
                    </Label>
                </div>

                <SubmitButton disabled={!agreedToTerms} />
            </form>
        </CardContent>
    </Card>
  );
}
