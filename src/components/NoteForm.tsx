
'use client';

import { useRef, useState, useEffect, useTransition } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNoteAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Subject, SubCategory, NoteMaterial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { checkChapterExists } from '@/lib/data';
import { Separator } from './ui/separator';


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
}).refine(data => data.pricePDF || data.pricePrinted, {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});

const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string(),
  imageUrl: z.string().url({ message: 'Please enter a valid main image URL.' }).optional().or(z.literal('')),
  items: z.array(NoteItemSchema).min(1, 'You must add at least one note type.'),
});


type NoteFormInputs = z.infer<typeof NoteFormSchema>;

type NoteFormProps = {
    onSuccess?: () => void;
    notes: NoteMaterial[];
}

const subjectsData: Subject[] = [
    { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
    { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
    { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
    { id: 'english', name: 'English', subcategories: [{id: 'moments', name: 'Moments'}, {id: 'beehive', name: 'Beehive'}, {id: 'grammar', name: 'Grammar'}] },
];

function SubmitButton({ isSubmitting, chapterExists }: { isSubmitting: boolean, chapterExists: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
      {isSubmitting ? 'Saving...' : (chapterExists ? 'Add Items to Existing Chapter' : 'Create New Chapter')}
    </Button>
  );
}

export function NoteForm({ onSuccess, notes }: NoteFormProps) {
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
  const [isChecking, startChecking] = useTransition();
  const [chapterExists, setChapterExists] = useState(false);

  const selectedSubjectJSON = watch('subject');
  const selectedSubcategoryJSON = watch('subcategory');
  const chapterName = watch('chapterName');

  useEffect(() => {
    if (selectedSubjectJSON) {
        try {
            const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
            setSubcategories(selectedSubject.subcategories || []);
            const currentSubcategoryJSON = watch('subcategory');
            if (currentSubcategoryJSON) {
                const currentSubcategory = JSON.parse(currentSubcategoryJSON);
                if (!selectedSubject.subcategories.some(sc => sc.id === currentSubcategory.id)) {
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

  useEffect(() => {
    const check = async () => {
        if (selectedSubjectJSON && selectedSubcategoryJSON && chapterName) {
            const subject: Subject = JSON.parse(selectedSubjectJSON);
            const subcategory: SubCategory = JSON.parse(selectedSubcategoryJSON);
            const exists = await checkChapterExists({
                subjectId: subject.id,
                subcategoryId: subcategory.id,
                chapter: chapterName
            });
            setChapterExists(exists);
        } else {
            setChapterExists(false);
        }
    };

    const handler = setTimeout(() => {
        startChecking(check);
    }, 500); // Debounce check

    return () => clearTimeout(handler);
  }, [selectedSubjectJSON, selectedSubcategoryJSON, chapterName]);

  const processForm = async (data: NoteFormInputs) => {
    setFormError(null);
    if (!chapterExists && !data.description) {
        setFormError("A main description is required for new chapters.");
        return;
    }

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
      reset();
      onSuccess?.();
    } else {
      setFormError(result.message);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(processForm)} className="space-y-6">
       {formError && (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>An Error Occurred</AlertTitle>
              <AlertDescription className="font-mono whitespace-pre-wrap">{formError}</AlertDescription>
          </Alert>
        )}
      
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Chapter Details</h3>
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
                                setValue('subcategory', '');
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
                <div className="relative">
                    <Input id="chapterName" {...register('chapterName')} />
                    {isChecking && <Loader2 className="animate-spin h-4 w-4 absolute right-3 top-3 text-muted-foreground" />}
                </div>
                {errors.chapterName && <p className="text-sm text-destructive mt-1">{errors.chapterName.message}</p>}
            </div>
            
            {!chapterExists && !isChecking && (
                <div className="space-y-4">
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
                </div>
            )}

            {chapterExists && !isChecking && (
                <Alert variant="default" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Existing Chapter Found</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                        This chapter already exists. Any items you add below will be appended to it.
                    </AlertDescription>
                </Alert>
            )}
        </div>

        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Add Note Types</h3>
            {errors.items?.root && <p className="text-sm text-destructive my-2">{errors.items.root.message}</p>}
            {errors.items && !errors.items.root && <p className="text-sm text-destructive my-2">Please check the errors in the note types below.</p>}

            {fields.map((field, index) => (
                <div key={field.id} className="space-y-3">
                    <h4 className="font-semibold text-md">Note Type #{index + 1}</h4>
                    <div className="p-4 border rounded-lg space-y-3 relative bg-muted/50">
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
                                <Input type="number" step="0.01" {...register(`items.${index}.pricePDF`)} placeholder="e.g., 50 or 0 for free"/>
                                {errors.items?.[index]?.pricePDF && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.pricePDF?.message}</p>}
                            </div>
                            <div>
                                <Label>Printed Price (₹)</Label>
                                <Input type="number" step="0.01" {...register(`items.${index}.pricePrinted`)} placeholder="e.g., 150. Leave blank if N/A."/>
                                {errors.items?.[index]?.pricePrinted && <p className="text-sm text-destructive mt-1">{errors.items?.[index]?.pricePrinted?.message}</p>}
                            </div>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Note Type
            </Button>
        </div>
      
      <SubmitButton isSubmitting={isSubmitting} chapterExists={chapterExists} />
    </form>
  );
}

    

    