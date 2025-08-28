
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { IndianRupee, QrCode, Copy, UploadCloud, ExternalLink, MessageSquare, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { placePrintOrderAction } from '@/lib/actions';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

const PrintFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userClass: z.string().min(1, 'Class is required'),
  whatsappNumber: z.string().min(10, "Please provide a valid 10-digit WhatsApp number."),
  instructions: z.string().optional(),
  paymentMethod: z.enum(['COD', 'UPI'], { required_error: "Please select a payment method." }),
  wormholeUrl: z.string().url("Please provide a valid Wormhole link."),
  terms: z.literal(true, {
    error_map: () => ({ message: "You must agree to the Terms and Conditions." })
  }),
});


type PrintFormInputs = z.infer<typeof PrintFormSchema>;

type PrintFormProps = {
    pricePerPage: number;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending || disabled} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Submitting...' : 'Submit for Printing'}
        </Button>
    );
}

export function PrintForm({ pricePerPage }: PrintFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [state, formAction] = useActionState(placePrintOrderAction, { success: false, message: '' });

    const { control, watch, handleSubmit, reset, formState: { errors } } = useForm<PrintFormInputs>({
        resolver: zodResolver(PrintFormSchema),
        defaultValues: {
            paymentMethod: 'COD',
            wormholeUrl: '',
            name: '',
            userClass: '',
            whatsappNumber: '',
            instructions: '',
            terms: false,
        }
    });

    const agreedToTerms = watch('terms');

    useEffect(() => {
        if (state.success && state.order) {
            toast({
                title: "Success!",
                description: "Your print request has been submitted. Redirecting...",
            });
            reset();
            const query = new URLSearchParams({
                order: JSON.stringify(state.order),
                isPrintRequest: 'true'
            }).toString();
            router.push(`/cart/confirmation?${query}`);
        } else if (state.message && !state.success) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast, reset, router]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText('nitish545454@ybl');
        toast({ title: 'Copied!', description: 'UPI ID copied to clipboard.'});
    };

  return (
    <>
        <Alert className="mb-8 border-primary/50 bg-primary/10 text-primary-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">₹{pricePerPage.toFixed(2)} per A4 Sheet (both sides)</AlertTitle>
            <AlertDescription className="text-primary/90">
                The final price will be calculated based on the total number of A4 sheets used for printing and confirmed with you via <a href="https://wa.me/917754000411" className="font-semibold underline hover:text-primary-foreground">WhatsApp</a>.
            </AlertDescription>
        </Alert>
        
        <Card>
            <CardHeader>
                <CardTitle>Submit Your Notes</CardTitle>
                <CardDescription>Upload your files, provide the link, and we'll handle the rest.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form 
                    action={handleSubmit((data) => {
                        const formData = new FormData();
                        Object.keys(data).forEach(key => {
                            const value = data[key as keyof typeof data];
                            if (typeof value === 'boolean') {
                                formData.append(key, value ? 'on' : '');
                            } else if (value) {
                                formData.append(key, value);
                            }
                        });
                        formAction(formData);
                    })}
                    className="space-y-6"
                >
                    {/* User Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Your Details</h3>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Controller name="name" control={control} render={({ field }) => <Input {...field} id="name" />} />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="userClass">Class</Label>
                            <Controller name="userClass" control={control} render={({ field }) => <Input {...field} id="userClass" placeholder="e.g., 10th A" />} />
                            {errors.userClass && <p className="text-sm text-destructive mt-1">{errors.userClass.message}</p>}
                        </div>
                         <div>
                            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                             <div className="relative mt-1">
                                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Controller name="whatsappNumber" control={control} render={({ field }) => <Input {...field} type="tel" id="whatsappNumber" placeholder="e.g., 9876543210" className="pl-10" />} />
                            </div>
                            {errors.whatsappNumber && <p className="text-sm text-destructive mt-1">{errors.whatsappNumber.message}</p>}
                        </div>
                    </div>

                    <Separator />

                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Upload Your Notes</h3>
                        <div className="p-4 rounded-lg border bg-muted/50 space-y-3 text-sm">
                           <div className="flex flex-col gap-4">
                                <div>
                                    <p className="font-semibold text-base mb-2 text-foreground">Step 1: Upload Files</p>
                                    <p className="text-muted-foreground">Click the button below to open Wormhole in a new tab. Drag and drop your files there to generate a secure sharing link.</p>
                                    <Button asChild variant="outline" className="mt-3" type="button">
                                        <a href="https://wormhole.app" target="_blank" rel="noopener noreferrer">
                                            <UploadCloud className="mr-2 h-4 w-4" /> Go to Wormhole.app
                                            <ExternalLink className="ml-2 h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                                 <div>
                                    <p className="font-semibold text-base mb-2 text-foreground">Step 2: Paste Link</p>
                                    <p className="text-muted-foreground">Once your upload is complete, copy the generated link and paste it into the field below.</p>
                                </div>
                           </div>
                        </div>

                        <div>
                            <Label htmlFor="wormholeUrl">Wormhole Share Link</Label>
                            <Controller name="wormholeUrl" control={control} render={({ field }) => <Input {...field} id="wormholeUrl" placeholder="https://wormhole.app/..." autoComplete="off" />} />
                            {errors.wormholeUrl && <p className="text-sm text-destructive mt-1">{errors.wormholeUrl.message}</p>}
                        </div>
                    </div>

                    <Separator />
                    
                    {/* Payment Method */}
                    <div>
                        <Label>Payment Method</Label>
                        <Controller
                            name="paymentMethod"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
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
                            )}
                        />
                         {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
                    </div>

                    {watch('paymentMethod') === 'UPI' && (
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

                    <Separator />

                    {/* Instructions */}
                     <div>
                        <Label htmlFor="instructions">Special Instructions</Label>
                        <Controller name="instructions" control={control} render={({ field }) => <Textarea {...field} id="instructions" placeholder="e.g., Black & white print, spiral binding, etc." />} />
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                         <Controller
                            name="terms"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="terms"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-normal">
                            I have read and agree to the 
                            <Link href="/terms" target="_blank" className="text-primary hover:underline underline-offset-2 ml-1">
                                Terms and Conditions
                            </Link>
                            .
                        </Label>
                    </div>
                    {errors.terms && <p className="text-sm text-destructive mt-1">{errors.terms.message}</p>}
                    
                    <SubmitButton disabled={!agreedToTerms} />
                </form>
            </CardContent>
        </Card>
    </>
  );
}
