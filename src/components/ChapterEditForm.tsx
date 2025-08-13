
'use client';

import { useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import type { NoteMaterial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { updateChapterInfoAction } from '@/lib/actions';

const ChapterEditSchema = z.object({
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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChapterEditInputs>({
    resolver: zodResolver(ChapterEditSchema),
    defaultValues: {
      chapterName: chapter.chapter,
      description: chapter.description,
      imageUrl: chapter.imageUrl,
    }
  });

  const processForm = async (data: ChapterEditInputs) => {
    setFormError(null);
    
    const formData = new FormData();
    formData.append('noteIds', chapter.noteIds.join(','));
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
