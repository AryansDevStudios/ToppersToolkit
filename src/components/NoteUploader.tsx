
'use client';

import { NoteForm } from './NoteForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function NoteUploader() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Chapter Notes</CardTitle>
        <CardDescription>
          A two-step process to add a new chapter and its associated study materials to the catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NoteForm />
      </CardContent>
    </Card>
  );
}
