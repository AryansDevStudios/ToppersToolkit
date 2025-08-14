
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSettingsAction } from '@/lib/actions';
import type { AdminSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Settings'}
    </Button>
  );
}

type SettingsManagerProps = {
  settings: AdminSettings;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateSettingsAction, { success: false, message: '' });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Manage global settings for the website.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold">Print on Demand</h3>
                    <div className="mt-4">
                        <Label htmlFor="printPricePerPage">Price Per Page (₹)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="printPricePerPage" 
                                name="printPricePerPage" 
                                type="number"
                                step="0.01"
                                defaultValue={settings.printPricePerPage}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>

                {state.message && (
                    <Alert variant={state.success ? 'default' : 'destructive'}>
                        {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}

                <SubmitButton />
            </form>
        </CardContent>
    </Card>
  )
}
