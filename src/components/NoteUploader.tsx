
'use client';

import { NoteForm } from './NoteForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { NoteMaterial } from '@/types';

export function NoteUploader({ notes }: { notes: NoteMaterial[] }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Chapter Notes</CardTitle>
        <CardDescription>
          Fill in the chapter details. The form will automatically detect if the chapter already exists and allow you to add more items to it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NoteForm notes={notes} />
      </CardContent>
    </Card>
  );
}
