
'use client';

import { useActionState, useEffect, useRef } from 'react';
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
import { IndianRupee, QrCode, Copy, UploadCloud, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { placePrintOrderAction } from '@/lib/actions';

const PrintFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userClass: z.string().min(1, 'Class is required'),
  instructions: z.string().optional(),
  paymentMethod: z.enum(['COD', 'UPI']),
  wormholeUrl: z.string().url("Please provide a valid Wormhole link."),
});

type PrintFormInputs = z.infer<typeof PrintFormSchema>;

type PrintFormProps = {
    pricePerPage: number;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Submitting...' : 'Submit for Printing'}
        </Button>
    );
}

export function PrintForm({ pricePerPage }: PrintFormProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(placePrintOrderAction, { success: false, message: '' });

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<PrintFormInputs>({
        resolver: zodResolver(PrintFormSchema),
        defaultValues: {
            paymentMethod: 'COD',
            wormholeUrl: '',
        }
    });

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success!",
                description: state.message,
            });
            formRef.current?.reset();
        } else if (state.message) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText('nitish545454@ybl');
        toast({ title: 'Copied!', description: 'UPI ID copied to clipboard.'});
    };

  return (
    <>
        <Alert className="mb-8 border-primary/50 bg-primary/10 text-primary-foreground">
            <IndianRupee className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-bold">Dynamic Pricing</AlertTitle>
            <AlertDescription className="text-primary/90">
                Our printing service costs <span className="font-bold">₹{pricePerPage.toFixed(2)} per page</span>. The final price will be calculated based on the total number of pages in your document(s) and confirmed with you via <a href="https://wa.me/917754000411" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-primary-foreground">WhatsApp</a>.
            </AlertDescription>
        </Alert>
        
        <Card>
            <CardHeader>
                <CardTitle>Submit Your Notes</CardTitle>
                <CardDescription>Upload your files, provide the link, and we'll handle the rest.</CardDescription>
            </CardHeader>
            <CardContent>
                <form 
                    ref={formRef}
                    action={formAction}
                    className="space-y-6"
                >
                    {/* User Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Your Details</h3>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="userClass">Class</Label>
                            <Input id="userClass" {...register('userClass')} placeholder="e.g., 10th A" />
                            {errors.userClass && <p className="text-sm text-destructive mt-1">{errors.userClass.message}</p>}
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
                                    <Button asChild variant="outline" className="mt-3">
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
                            <Input id="wormholeUrl" {...register('wormholeUrl')} placeholder="https://wormhole.app/..." />
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
                                    value={field.value}
                                    onValueChange={(value) => field.onChange(value as 'COD' | 'UPI')}
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
                        <Textarea id="instructions" {...register('instructions')} placeholder="e.g., Black & white print, spiral binding, etc." />
                    </div>
                    
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    </>
  );
}
