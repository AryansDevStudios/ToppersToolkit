
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
import { IndianRupee, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save All Settings'}
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
    <div className="max-w-2xl mx-auto">
        <form action={formAction} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Print on Demand</CardTitle>
                    <CardDescription>Manage pricing for the custom printing service.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="printPricePerPage">Price Per Page (₹)</Label>
                        <div className="relative mt-2">
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
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Admin Security</CardTitle>
                    <CardDescription>
                        Update the passphrase used to access the admin portal. Leave fields blank to keep the current one.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="newPassphrase">New Passphrase</Label>
                         <div className="relative mt-2">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="newPassphrase" 
                                name="newPassphrase" 
                                type="password"
                                placeholder="Enter new passphrase"
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="confirmPassphrase">Confirm New Passphrase</Label>
                         <div className="relative mt-2">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="confirmPassphrase" 
                                name="confirmPassphrase" 
                                type="password"
                                placeholder="Confirm new passphrase"
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>


            {state.message && (
                <Alert variant={state.success ? 'default' : 'destructive'}>
                    {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
        </form>
    </div>
  )
}
