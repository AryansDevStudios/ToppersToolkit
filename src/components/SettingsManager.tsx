
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSettingsAction } from '@/lib/actions';
import type { AdminSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee, KeyRound } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function PriceSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Price'}
    </Button>
  );
}

function PassphraseSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Updating...' : 'Update Passphrase'}
    </Button>
  );
}

type SettingsManagerProps = {
  settings: AdminSettings;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const { toast } = useToast();
  const [priceState, priceFormAction] = useActionState(updateSettingsAction, { success: false, message: '' });
  const [passphraseState, passphraseFormAction] = useActionState(updateSettingsAction, { success: false, message: '' });
  const passphraseFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (priceState.message) {
      toast({
        title: priceState.success ? 'Success!' : 'Error',
        description: priceState.message,
        variant: priceState.success ? 'default' : 'destructive',
      });
    }
  }, [priceState, toast]);

  useEffect(() => {
    if (passphraseState.message) {
      toast({
        title: passphraseState.success ? 'Success!' : 'Error',
        description: passphraseState.message,
        variant: passphraseState.success ? 'default' : 'destructive',
      });
      if (passphraseState.success) {
        passphraseFormRef.current?.reset();
      }
    }
  }, [passphraseState, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <form action={priceFormAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Print on Demand</CardTitle>
                    <CardDescription>Manage pricing for the custom printing service.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                     <PriceSubmitButton />
                </CardContent>
            </Card>
        </form>

        <form action={passphraseFormAction} ref={passphraseFormRef}>
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
                                autoComplete="new-password"
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
                    <PassphraseSubmitButton />
                </CardContent>
            </Card>
        </form>
    </div>
  )
}
