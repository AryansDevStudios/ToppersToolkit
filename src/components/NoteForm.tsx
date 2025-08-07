
'use client';

import { useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNoteAction, updateNoteAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Subject, SubCategory, NoteMaterial, NotePrices } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const PriceSchema = z.coerce.number().min(0, 'Price must be non-negative').optional();

const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  priceHandwrittenPDF: PriceSchema,
  priceHandwrittenPrinted: PriceSchema,
  priceTypedPDF: PriceSchema,
  priceTypedPrinted: PriceSchema,
  priceQuestionBankPDF: PriceSchema,
  priceQuestionBankPrinted: PriceSchema,
}).refine(data => {
    return data.priceHandwrittenPDF || data.priceHandwrittenPrinted ||
           data.priceTypedPDF || data.priceTypedPrinted ||
           data.priceQuestionBankPDF || data.priceQuestionBankPrinted;
}, {
    message: "At least one price must be entered.",
    path: ["priceHandwrittenPDF"], 
});


type NoteFormInputs = z.infer<typeof NoteFormSchema>;

type NoteFormProps = {
    note?: NoteMaterial;
    onSuccess?: () => void;
}

const subjectsData: Subject[] = [
    { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
    { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
    { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
    { id: 'english', name: 'English', subcategories: [{id: 'moments', name: 'Moments'}, {id: 'beehive', name: 'Beehive'}, {id: 'grammar', name: 'Grammar'}] },
];

function SubmitButton({ isEditing, isSubmitting }: { isEditing: boolean, isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
      {isSubmitting ? (isEditing ? 'Updating Note...' : 'Adding Note...') : (isEditing ? 'Update Note' : 'Add Note')}
    </Button>
  );
}

export function NoteForm({ note, onSuccess }: NoteFormProps) {
  const isEditing = !!note;
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const { register, watch, setValue, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteFormInputs>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: {
      subject: note ? JSON.stringify({ id: note.subjectId, name: note.subjectName, subcategories: subjectsData.find(s => s.id === note.subjectId)?.subcategories }) : '',
      subcategory: note ? JSON.stringify({ id: note.subcategoryId, name: note.subcategoryName }) : '',
      chapterName: note?.chapter || '',
      description: note?.description || '',
      imageUrl: note?.imageUrl || '',
      priceHandwrittenPDF: note?.prices.handwritten?.pdf || undefined,
      priceHandwrittenPrinted: note?.prices.handwritten?.printed || undefined,
      priceTypedPDF: note?.prices.typed?.pdf || undefined,
      priceTypedPrinted: note?.prices.typed?.printed || undefined,
      priceQuestionBankPDF: note?.prices.questionBank?.pdf || undefined,
      priceQuestionBankPrinted: note?.prices.questionBank?.printed || undefined,
    }
  });
  
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const selectedSubjectJSON = watch('subject');

  useEffect(() => {
    if (selectedSubjectJSON) {
        try {
            const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
            setSubcategories(selectedSubject.subcategories || []);
            if (!isEditing || (note?.subjectId !== selectedSubject.id)) {
                setValue('subcategory', '');
            }
        } catch (e) {
            setSubcategories([]);
        }
    } else {
        setSubcategories([]);
    }
  }, [selectedSubjectJSON, setValue, note, isEditing]);
  
  const processForm = async (data: NoteFormInputs) => {
    const action = isEditing ? updateNoteAction : addNoteAction;
    
    const formData = new FormData(formRef.current!);
    
    const result = await action(null, formData);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      router.refresh();
      if (!isEditing) {
        reset();
        formRef.current?.reset();
        setSubcategories([]);
      }
      onSuccess?.();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(processForm)} className="space-y-4">
      {isEditing && <input type="hidden" name="noteId" value={note.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <Select 
            value={watch('subject')}
            onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
            name="subject"
          >
            <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
            <SelectContent>
              {subjectsData.map((s) => (
                <SelectItem key={s.id} value={JSON.stringify(s)}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
        </div>
        <div>
          <Label>Subcategory</Label>
          <Select 
            value={watch('subcategory')}
            onValueChange={(value) => setValue('subcategory', value, { shouldValidate: true })} 
            disabled={!selectedSubjectJSON}
            name="subcategory"
          >
            <SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger>
            <SelectContent>
              {subcategories.map((sc) => (
                <SelectItem key={sc.id} value={JSON.stringify(sc)}>{sc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subcategory && <p className="text-sm text-destructive mt-1">{errors.subcategory.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="chapterName">Chapter Name</Label>
        <Input id="chapterName" {...register('chapterName')} />
        {errors.chapterName && <p className="text-sm text-destructive mt-1">{errors.chapterName.message}</p>}
      </div>
       
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>

      <Card className="pt-4">
          <CardHeader>
              <CardTitle>Pricing (₹)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
               {errors.priceHandwrittenPDF && <p className="text-sm text-destructive mt-1">{errors.priceHandwrittenPDF.message}</p>}
              <div className="space-y-2">
                  <h4 className="font-semibold">Handwritten Notes</h4>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="priceHandwrittenPDF">PDF Price</Label>
                          <Input id="priceHandwrittenPDF" type="number" {...register('priceHandwrittenPDF')} placeholder="e.g., 50"/>
                      </div>
                      <div>
                          <Label htmlFor="priceHandwrittenPrinted">Printed Price</Label>
                          <Input id="priceHandwrittenPrinted" type="number" {...register('priceHandwrittenPrinted')} placeholder="e.g., 150"/>
                      </div>
                  </div>
              </div>
              <div className="space-y-2">
                  <h4 className="font-semibold">Typed Notes</h4>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="priceTypedPDF">PDF Price</Label>
                          <Input id="priceTypedPDF" type="number" {...register('priceTypedPDF')} placeholder="e.g., 40"/>
                      </div>
                      <div>
                          <Label htmlFor="priceTypedPrinted">Printed Price</Label>
                          <Input id="priceTypedPrinted" type="number" {...register('priceTypedPrinted')} placeholder="e.g., 120"/>
                      </div>
                  </div>
              </div>
              <div className="space-y-2">
                  <h4 className="font-semibold">Question Bank</h4>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <Label htmlFor="priceQuestionBankPDF">PDF Price</Label>
                          <Input id="priceQuestionBankPDF" type="number" {...register('priceQuestionBankPDF')} placeholder="e.g., 60"/>
                      </div>
                      <div>
                          <Label htmlFor="priceQuestionBankPrinted">Printed Price</Label>
                          <Input id="priceQuestionBankPrinted" type="number" {...register('priceQuestionBankPrinted')} placeholder="e.g., 180"/>
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>
      
      <SubmitButton isEditing={isEditing} isSubmitting={isSubmitting} />
    </form>
  );
}
