'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { addNoteAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Subject, SubCategory } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const NoteUploaderSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  noteType: z.string().min(1, 'Please select a note type'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type NoteUploaderInputs = z.infer<typeof NoteUploaderSchema>;

const subjectsData: Subject[] = [
    { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
    { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
    { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
    { id: 'english', name: 'English', subcategories: [{id: 'literature', name: 'Literature'}, {id: 'grammar', name: 'Grammar'}] },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Adding Note...' : 'Add Note'}
    </Button>
  );
}

export function NoteUploader() {
  const [state, formAction] = useActionState(addNoteAction, { success: false, message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<NoteUploaderInputs>({
    resolver: zodResolver(NoteUploaderSchema),
    defaultValues: {
      subject: '',
      subcategory: '',
      chapterName: '',
      noteType: '',
      description: '',
      imageUrl: '',
    }
  });
  
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const selectedSubjectJSON = watch('subject');


  useEffect(() => {
    if (selectedSubjectJSON) {
      try {
        const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
        setSubcategories(selectedSubject.subcategories || []);
        setValue('subcategory', '');
      } catch (e) {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [selectedSubjectJSON, setValue]);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      reset();
      formRef.current?.reset();
      setSubcategories([]);
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, reset]);

  const noteTypes = ['Notes', 'Question Bank', 'Important Dates', 'Summary'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Note</CardTitle>
        <CardDescription>Fill out the form to add a new note to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} onSubmit={handleSubmit((data) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if(value) {
                    formData.append(key, value);
                }
            });
            formAction(formData);
        })} className="space-y-4">
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
            <Label>Note Type</Label>
            <Select 
              value={watch('noteType')}
              onValueChange={(value) => setValue('noteType', value, { shouldValidate: true })}
              name="noteType"
            >
              <SelectTrigger><SelectValue placeholder="Select a note type" /></SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.noteType && <p className="text-sm text-destructive mt-1">{errors.noteType.message}</p>}
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
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
