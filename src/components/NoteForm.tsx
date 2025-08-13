
'use client';

import { useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNoteAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Subject, SubCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const PriceSchema = z.string().refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: 'Price must be a non-negative number or empty.',
}).optional();

const NoteItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Note type name is required.'),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
    pricePDF: PriceSchema,
    pricePrinted: PriceSchema,
}).refine(data => (data.pricePDF !== undefined && data.pricePDF !== '') || (data.pricePrinted !== undefined && data.pricePrinted !== ''), {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});

const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string().min(1, 'A main description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid main image URL.' }).optional().or(z.literal('')),
  items: z.array(NoteItemSchema).min(1, 'You must add at least one note type.'),
});


type NoteFormInputs = z.infer<typeof NoteFormSchema>;

type NoteFormProps = {
    onSuccess?: () => void;
}

const subjectsData: Subject[] = [
    { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
    { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
    { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
    { id: 'english', name: 'English', subcategories: [{id: 'moments', name: 'Moments'}, {id: 'beehive', name: 'Beehive'}, {id: 'grammar', name: 'Grammar'}] },
];

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
      {isSubmitting ? 'Adding Note...' : 'Add Note'}
    </Button>
  );
}

export function NoteForm({ onSuccess }: NoteFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, control, watch, setValue, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteFormInputs>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: {
      subject: '',
      subcategory: '',
      chapterName: '',
      description: '',
      imageUrl: '',
      items: [{ id: nanoid(), name: '', description: '', imageUrl: '', pricePDF: '', pricePrinted: ''}],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const selectedSubjectJSON = watch('subject');

  useEffect(() => {
    if (selectedSubjectJSON) {
        try {
            const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
            setSubcategories(selectedSubject.subcategories || []);
            const currentSubcategory = watch('subcategory');
            if (currentSubcategory) {
                const parsedSubcategory = JSON.parse(currentSubcategory);
                if (!selectedSubject.subcategories.some(sc => sc.id === parsedSubcategory.id)) {
                    setValue('subcategory', '');
                }
            }
        } catch (e) {
            setSubcategories([]);
            setValue('subcategory', '');
        }
    } else {
        setSubcategories([]);
        setValue('subcategory', '');
    }
  }, [selectedSubjectJSON, setValue, watch]);
  
  const processForm = async (data: NoteFormInputs) => {
    setFormError(null);
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('subcategory', data.subcategory);
    formData.append('chapterName', data.chapterName);
    formData.append('description', data.description);
    formData.append('imageUrl', data.imageUrl || '');
    formData.append('items', JSON.stringify(data.items));
    
    const result = await addNoteAction(null, formData);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      router.refresh();
      reset({ subject: '', subcategory: '', chapterName: '', description: '', imageUrl: '', items: [] });
      formRef.current?.reset();
      setSubcategories([]);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue('subcategory', ''); // Reset subcategory on subject change
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>
                  {subjectsData.map((s) => (
                    <SelectItem key={s.id} value={JSON.stringify(s)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
           {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
        </div>
        <div>
          <Label>Subcategory</Label>
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedSubjectJSON}
              >
                <SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger>
                <SelectContent>
                  {subcategories.map((sc) => (
                    <SelectItem key={sc.id} value={JSON.stringify(sc)}>{sc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.subcategory && <p className="text-sm text-destructive mt-1">{errors.subcategory.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="chapterName">Chapter Name</Label>
        <Input id="chapterName" {...register('chapterName')} />
        {errors.chapterName && <p className="text-sm text-destructive mt-1">{errors.chapterName.message}</p>}
      </div>
       
      <div>
        <Label htmlFor="description">Main Description</Label>
        <Textarea id="description" {...register('description')} placeholder="This description applies to the whole chapter entry."/>
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="imageUrl">Main Image URL (Optional)</Label>
        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://... (used as a fallback for all note types)" />
        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Note Types</CardTitle>
          <CardDescription>Add one or more note types for this chapter, like "Summary", "Question Bank", etc.</CardDescription>
          {errors.items?.root && <p className="text-sm text-destructive mt-2">{errors.items.root.message}</p>}
          {errors.items && !errors.items.root && <p className="text-sm text-destructive mt-2">Please check the errors in the note types below.</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
                {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
              <div>
                <Label>Note Type Name</Label>
                <Input {...register(`items.${index}.name`)} placeholder='e.g., Handwritten Notes, Summary' />
                 {errors.items?.[index]?.name && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.name?.message}</p>}
                 {errors.items?.[index]?.root && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.root?.message}</p>}
              </div>
              <div>
                <Label>Specific Description (Optional)</Label>
                <Textarea {...register(`items.${index}.description`)} placeholder="Describe this specific note type."/>
              </div>
              <div>
                <Label>Specific Image URL (Optional)</Label>
                <Input {...register(`items.${index}.imageUrl`)} placeholder="Overrides main image for this type" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label>PDF Price (₹)</Label>
                      <Input type="number" step="0.01" {...register(`items.${index}.pricePDF`)} placeholder="e.g., 50 or 0 for free. Leave blank if N/A."/>
                      {errors.items?.[index]?.pricePDF && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.pricePDF?.message}</p>}
                  </div>
                  <div>
                      <Label>Printed Price (₹)</Label>
                      <Input type="number" step="0.01" {...register(`items.${index}.pricePrinted`)} placeholder="e.g., 150. Leave blank if N/A."/>
                      {errors.items?.[index]?.pricePrinted && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.pricePrinted?.message}</p>}
                  </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ id: nanoid(), name: '', description: '', imageUrl: '', pricePDF: '', pricePrinted: ''})}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Note Type
          </Button>
        </CardContent>
      </Card>
      
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
