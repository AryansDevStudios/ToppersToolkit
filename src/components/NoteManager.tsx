'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { deleteNoteAction } from '@/lib/actions';
import type { NoteMaterial } from '@/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type NoteManagerProps = {
  notes: NoteMaterial[];
};

export function NoteManager({ notes }: NoteManagerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);


  const handleDelete = (noteId: string) => {
    setDeletingId(noteId);
    startTransition(async () => {
      const result = await deleteNoteAction(noteId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
      setDeletingId(null);
    });
  };

  if (notes.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No Notes Found</CardTitle>
                <CardDescription>Uploaded notes will appear here for management.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <div className="flex items-start gap-4">
                {note.imageUrl && (
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                        src={note.imageUrl}
                        alt={note.chapter}
                        fill
                        className="object-cover"
                        data-ai-hint="note education"
                        />
                    </div>
                )}
                <div className="flex-grow">
                    <CardTitle className="text-xl">{note.chapter}</CardTitle>
                    <CardDescription>
                        <Badge variant="outline">{note.subjectName} / {note.subcategoryName}</Badge>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <Badge variant="secondary">{note.type}</Badge>
                    </CardDescription>
                     <p className="text-sm text-muted-foreground mt-2">{note.description}</p>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
                Uploaded on: {format(new Date(note.createdAt as any), 'PPP p')}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the note
                    from your database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(note.id)}
                    disabled={isPending && deletingId === note.id}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isPending && deletingId === note.id ? 'Deleting...' : 'Yes, delete it'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
