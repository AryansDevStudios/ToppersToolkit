
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { deleteNoteAction, toggleNoteStatusAction } from '@/lib/actions';
import type { NoteMaterial } from '@/types';
import { NoteForm } from '@/components/NoteForm';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, EyeOff, IndianRupee, ImageOff, FileText, Printer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NoteImage } from './NoteImage';

type NoteManagerProps = {
  notes: NoteMaterial[];
};

export function NoteManager({ notes }: NoteManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const getFormattedTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${format(date, 'p, PPP')} UTC`;
  };
  
  const handleDelete = (note: NoteMaterial) => {
    startTransition(async () => {
      const result = await deleteNoteAction(note.id, note.subjectId, note.subcategoryId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleToggleStatus = (note: NoteMaterial) => {
    startTransition(async () => {
      const result = await toggleNoteStatusAction(note.id, note.status, note.subjectId, note.subcategoryId);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
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
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        return (
          <Card key={note.id} className={note.status === 'hidden' ? 'bg-muted/50' : ''}>
            <CardHeader>
              <div className="flex items-start gap-4 flex-wrap">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <NoteImage
                        src={note.imageUrl}
                        alt={note.chapter}
                        fallbackIcon={<ImageOff className="h-10 w-10 text-muted-foreground" />}
                    />
                  </div>
                <div className="flex-grow">
                  <CardTitle className="text-xl">{note.chapter}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline">{note.subjectName} / {note.subcategoryName}</Badge>
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">{note.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uploaded on: {getFormattedTime(note.createdAt as any)}
                  </p>
                   <div className="font-semibold text-sm flex flex-col mt-2 gap-2">
                        {note.prices?.handwritten && (note.prices.handwritten.pdf || note.prices.handwritten.printed) && <p><b>Handwritten:</b> PDF: ₹{note.prices.handwritten.pdf || 'N/A'} / Printed: ₹{note.prices.handwritten.printed || 'N/A'}</p>}
                        {note.prices?.typed && (note.prices.typed.pdf || note.prices.typed.printed) && <p><b>Typed:</b> PDF: ₹{note.prices.typed.pdf || 'N/A'} / Printed: ₹{note.prices.typed.printed || 'N/A'}</p>}
                        {note.prices?.questionBank && (note.prices.questionBank.pdf || note.prices.questionBank.printed) && <p><b>Question Bank:</b> PDF: ₹{note.prices.questionBank.pdf || 'N/A'} / Printed: ₹{note.prices.questionBank.printed || 'N/A'}</p>}
                   </div>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex flex-wrap justify-between items-center gap-2">
               <div className="flex items-center space-x-2">
                  <Switch 
                      id={`status-${note.id}`} 
                      checked={note.status === 'published'}
                      onCheckedChange={() => handleToggleStatus(note)}
                      disabled={isPending}
                      aria-label="Toggle note visibility"
                  />
                  <Label htmlFor={`status-${note.id}`} className="flex items-center gap-1 text-sm">
                      {note.status === 'published' ? <><Eye className="h-4 w-4"/> Published</> : <><EyeOff className="h-4 w-4"/> Hidden</>}
                  </Label>
               </div>
              <div className="flex gap-2">
                  <Dialog open={activeDialog === note.id} onOpenChange={(open) => setActiveDialog(open ? note.id : null)}>
                      <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={isPending}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                          <DialogHeader>
                              <DialogTitle>Edit Note</DialogTitle>
                          </DialogHeader>
                           <div className="overflow-y-auto p-1">
                              <NoteForm 
                                  note={note} 
                                  onSuccess={() => setActiveDialog(null)}
                              />
                          </div>
                      </DialogContent>
                  </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isPending}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the note from your database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(note)}
                        disabled={isPending}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isPending ? 'Deleting...' : 'Yes, delete it'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}
