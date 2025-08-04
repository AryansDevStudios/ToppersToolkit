'use client';

import { NoteForm } from './NoteForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function NoteUploader() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Note</CardTitle>
        <CardDescription>Fill out the form to add a new note to the catalog.</CardDescription>
      </CardHeader>
      <CardContent>
        <NoteForm />
      </CardContent>
    </Card>
  );
}
