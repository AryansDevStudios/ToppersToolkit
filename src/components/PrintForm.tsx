
'use client';

import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Trash2, PlusCircle, IndianRupee, QrCode, Copy } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const PrintFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userClass: z.string().min(1, 'Class is required'),
  instructions: z.string().optional(),
  isPdf: z.boolean(),
  paymentMethod: z.enum(['COD', 'UPI']),
  pdfUrl: z.string().optional(),
  imageUrls: z.array(z.object({ value: z.string().url('Please enter a valid URL') })).optional(),
}).refine(data => {
    if (data.isPdf) {
        return !!data.pdfUrl && z.string().url().safeParse(data.pdfUrl).success;
    }
    return data.imageUrls && data.imageUrls.length > 0 && data.imageUrls.every(url => url.value !== '');
}, {
    message: 'Please provide a valid URL for the selected format.',
    path: ['pdfUrl'], // Point error to the most likely field
});

type PrintFormInputs = z.infer<typeof PrintFormSchema>;

type PrintFormProps = {
    pricePerPage: number;
}

export function PrintForm({ pricePerPage }: PrintFormProps) {
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');

    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PrintFormInputs>({
        resolver: zodResolver(PrintFormSchema),
        defaultValues: {
            isPdf: true,
            pdfUrl: '',
            imageUrls: [{ value: '' }],
            paymentMethod: 'COD',
        }
    });

    const isPdf = watch('isPdf');

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'imageUrls',
    });

    const processSubmit = (data: PrintFormInputs) => {
        // Here you would typically send the data to a server action
        console.log(data);
        alert('Form submitted! Check console for data.');
    };
    
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
                <CardDescription>Fill out your details and provide the link to your notes.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
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

                    {/* Note Source */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Note Source</h3>
                         <div className="flex items-center space-x-2">
                            <Label htmlFor="format-switch">Images</Label>
                            <Controller
                                name="isPdf"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="format-switch"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="format-switch">PDF</Label>
                        </div>
                        
                        {isPdf ? (
                            <div>
                                <Label htmlFor="pdfUrl">PDF URL</Label>
                                <Input id="pdfUrl" {...register('pdfUrl')} placeholder="https://example.com/notes.pdf" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Label>Image URLs</Label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <Input {...register(`imageUrls.${index}.value`)} placeholder="https://example.com/image.png" />
                                        {fields.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" className="w-full" onClick={() => append({ value: '' })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add another image
                                </Button>
                            </div>
                        )}
                        {errors.pdfUrl && <p className="text-sm text-destructive mt-1">{errors.pdfUrl.message}</p>}
                         {errors.imageUrls && <p className="text-sm text-destructive mt-1">Please provide a valid URL for each image.</p>}
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
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setPaymentMethod(value as 'COD' | 'UPI');
                                    }}
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


                    <Separator />

                    {/* Instructions */}
                     <div>
                        <Label htmlFor="instructions">Special Instructions</Label>
                        <Textarea id="instructions" {...register('instructions')} placeholder="e.g., Black & white print, spiral binding, etc." />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Submitting...' : 'Submit for Printing'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </>
  );
}
