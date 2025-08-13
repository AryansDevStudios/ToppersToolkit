
'use client';

import { useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import type { NoteMaterial, Subject, SubCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { updateChapterInfoAction } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const subjectsData: Subject[] = [
    { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
    { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
    { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
    { id: 'english', name: 'English', subcategories: [{id: 'moments', name: 'Moments'}, {id: 'beehive', name: 'Beehive'}, {id: 'grammar', name: 'Grammar'}] },
];

const ChapterEditSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
});

type ChapterEditInputs = z.infer<typeof ChapterEditSchema>;

type ChapterEditFormProps = {
    chapter: NoteMaterial & { noteIds: string[] };
    onSuccess?: () => void;
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
      {isSubmitting ? 'Updating...' : 'Update Chapter Info'}
    </Button>
  );
}

export function ChapterEditForm({ chapter, onSuccess }: ChapterEditFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  const findSubject = (subjectId: string) => subjectsData.find(s => s.id === subjectId);
  const findSubcategory = (subject: Subject | undefined, subcategoryId: string) => subject?.subcategories.find(sc => sc.id === subcategoryId);
  
  const initialSubject = findSubject(chapter.subjectId);
  const initialSubcategory = findSubcategory(initialSubject, chapter.subcategoryId);

  const { register, control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChapterEditInputs>({
    resolver: zodResolver(ChapterEditSchema),
    defaultValues: {
      subject: initialSubject ? JSON.stringify(initialSubject) : '',
      subcategory: initialSubcategory ? JSON.stringify(initialSubcategory) : '',
      chapterName: chapter.chapter,
      description: chapter.description,
      imageUrl: chapter.imageUrl,
    }
  });

  const selectedSubjectJSON = watch('subject');

  useEffect(() => {
    if (selectedSubjectJSON) {
        try {
            const selectedSubject = JSON.parse(selectedSubjectJSON) as Subject;
            setSubcategories(selectedSubject.subcategories || []);
            const currentSubcategoryJSON = watch('subcategory');
            // If there's a subcategory selected, check if it belongs to the new subject
            if (currentSubcategoryJSON) {
                const currentSubcategory = JSON.parse(currentSubcategoryJSON);
                if (!selectedSubject.subcategories.some(sc => sc.id === currentSubcategory.id)) {
                    setValue('subcategory', ''); // Reset if not valid for the current subject
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


  const processForm = async (data: ChapterEditInputs) => {
    setFormError(null);
    
    const formData = new FormData();
    formData.append('noteIds', chapter.noteIds.join(','));
    formData.append('subject', data.subject);
    formData.append('subcategory', data.subcategory);
    formData.append('chapterName', data.chapterName);
    formData.append('description', data.description || '');
    formData.append('imageUrl', data.imageUrl || '');

    const result = await updateChapterInfoAction(null, formData);

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
        <Label>Chapter Name</Label>
        <Input {...register('chapterName')} />
        {errors.chapterName && <p className="text-sm text-destructive mt-1">{errors.chapterName.message}</p>}
      </div>
      <div>
        <Label>Main Description</Label>
        <Textarea {...register('description')} />
         {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label>Main Image URL (Optional)</Label>
        <Input {...register('imageUrl')} placeholder="https://..." />
         {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>
      
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
