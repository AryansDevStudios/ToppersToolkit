
'use client';

import { useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import type { NoteMaterial, NoteItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { addNoteItemAction, updateNoteItemAction } from '@/lib/actions';

const PriceSchema = z.string().refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: 'Price must be a non-negative number or empty.',
}).optional();

const NoteItemFormSchema = z.object({
    name: z.string().min(1, 'Note type name is required.'),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
    pricePDF: PriceSchema,
    pricePrinted: PriceSchema,
}).refine(data => (data.pricePDF !== undefined && data.pricePDF !== '') || (data.pricePrinted !== undefined && data.pricePrinted !== ''), {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});

type NoteItemFormInputs = z.infer<typeof NoteItemFormSchema>;

type NoteItemFormProps = {
    note: NoteMaterial;
    item?: NoteItem; // If item is not provided, it's an "add" form
    onSuccess?: () => void;
}

function SubmitButton({ isEditing, isSubmitting }: { isEditing: boolean, isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
      {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Item' : 'Add New Item')}
    </Button>
  );
}

export function NoteItemForm({ note, item, onSuccess }: NoteItemFormProps) {
  const isEditing = !!item;
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteItemFormInputs>({
    resolver: zodResolver(NoteItemFormSchema),
    defaultValues: {
      name: item?.name || '',
      description: item?.description || '',
      imageUrl: item?.imageUrl || '',
      pricePDF: item?.prices.pdf !== undefined ? String(item.prices.pdf) : '',
      pricePrinted: item?.prices.printed !== undefined ? String(item.prices.printed) : '',
    }
  });

  const processForm = async (data: NoteItemFormInputs) => {
    setFormError(null);
    const action = isEditing ? updateNoteItemAction : addNoteItemAction;
    
    const formData = new FormData();
    formData.append('noteId', note.id);
    if(isEditing && item) {
        formData.append('itemId', item.id);
    }
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('imageUrl', data.imageUrl || '');
    formData.append('pricePDF', data.pricePDF || '');
    formData.append('pricePrinted', data.pricePrinted || '');

    const result = await action(null, formData);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      router.refresh();
      onSuccess?.();
    } else {
      setFormError(result.message);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(processForm)} className="space-y-4">
       {formError && (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="font-mono whitespace-pre-wrap">{formError}</AlertDescription>
          </Alert>
        )}
      
      <div>
        <Label>Note Type Name</Label>
        <Input {...register('name')} placeholder='e.g., Handwritten Notes, Summary' />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label>Specific Description (Optional)</Label>
        <Textarea {...register('description')} placeholder="Describe this specific note type."/>
      </div>
      <div>
        <Label>Specific Image URL (Optional)</Label>
        <Input {...register('imageUrl')} placeholder="Overrides main image for this item" />
         {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
              <Label>PDF Price (₹)</Label>
              <Input type="number" step="0.01" {...register('pricePDF')} placeholder="e.g., 50 or 0 for free"/>
              {errors.pricePDF && <p className="text-sm text-destructive mt-1">{errors.pricePDF.message}</p>}
          </div>
          <div>
              <Label>Printed Price (₹)</Label>
              <Input type="number" step="0.01" {...register('pricePrinted')} placeholder="e.g., 150"/>
              {errors.pricePrinted && <p className="text-sm text-destructive mt-1">{errors.pricePrinted.message}</p>}
          </div>
      </div>
      
      <SubmitButton isEditing={isEditing} isSubmitting={isSubmitting} />
    </form>
  );
}

