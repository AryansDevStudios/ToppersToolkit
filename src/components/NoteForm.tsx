
'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { addNoteAction, updateNoteAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Subject, SubCategory, NoteMaterial } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  noteType: z.string().min(1, 'Note type is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
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
    <Button type="submit" disabled={isSubmitting} className="w-full">
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
      noteType: note?.type || '',
      description: note?.description || '',
      imageUrl: note?.imageUrl || '',
      price: note?.price || 0,
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
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    if (isEditing && note) {
      formData.append('noteId', note.id);
    }
    
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
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="noteType">Note Type</Label>
          <Input id="noteType" {...register('noteType')} placeholder="e.g., Notes, Question Bank..." />
          {errors.noteType && <p className="text-sm text-destructive mt-1">{errors.noteType.message}</p>}
        </div>
        <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" {...register('price')} />
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
        </div>
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
      <SubmitButton isEditing={isEditing} isSubmitting={isSubmitting} />
    </form>
  );
}
