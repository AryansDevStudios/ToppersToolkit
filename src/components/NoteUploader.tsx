'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef, useActionState } from 'react';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Adding Note...' : 'Add Note'}
    </Button>
  );
}

export function NoteUploader({ subjects }: { subjects: Subject[] }) {
  const [state, formAction] = useActionState(addNoteAction, { success: false, message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<NoteUploaderInputs>({
    resolver: zodResolver(NoteUploaderSchema),
  });

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const selectedSubjectJSON = watch('subject');

  useEffect(() => {
    if (selectedSubjectJSON) {
      const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
      setSubcategories(selectedSubject.subcategories || []);
      setValue('subcategory', '');
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
      formRef.current?.reset();
      setSubcategories([]);
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const noteTypes = ['Notes', 'Question Bank', 'Important Dates', 'Summary'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Note</CardTitle>
        <CardDescription>Fill out the form to add a new note to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject</Label>
              <Select onValueChange={(value) => setValue('subject', value)}>
                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={JSON.stringify(s)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <input type="hidden" {...register('subject')} />
               {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select onValueChange={(value) => setValue('subcategory', value)} disabled={!selectedSubjectJSON}>
                <SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger>
                <SelectContent>
                  {subcategories.map((sc) => (
                    <SelectItem key={sc.id} value={JSON.stringify(sc)}>{sc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('subcategory')} />
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
            <Select onValueChange={(value) => setValue('noteType', value)}>
              <SelectTrigger><SelectValue placeholder="Select a note type" /></SelectTrigger>
              <SelectContent>
                {noteTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('noteType')} />
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
