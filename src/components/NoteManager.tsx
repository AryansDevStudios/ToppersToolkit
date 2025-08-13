
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteNoteItemAction, updateNoteItemAction, toggleNoteStatusAction } from '@/lib/actions';
import type { NoteMaterial, NoteItem } from '@/types';
import { NoteForm } from '@/components/NoteForm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, EyeOff, ChevronDown, BookOpen, PlusCircle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { NoteImage } from './NoteImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NoteItemForm } from './NoteItemForm';


type GroupedNote = NoteMaterial & {
  noteIds: string[];
};

type NoteManagerProps = {
  notes: NoteMaterial[];
};

export function NoteManager({ notes }: NoteManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openCollapsibleId, setOpenCollapsibleId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ note: NoteMaterial, item: NoteItem } | null>(null);
  const [addingToNote, setAddingToNote] = useState<NoteMaterial | null>(null);


  const groupedNotes = notes.reduce((acc, note) => {
    const key = `${note.subjectId}-${note.subcategoryId}-${note.chapter}`;
    if (!acc[key]) {
      acc[key] = {
        ...note,
        items: [],
        noteIds: [],
      };
    }
    // Aggregate items and original note IDs
    if (Array.isArray(note.items)) {
      acc[key].items.push(...note.items);
    }
    acc[key].noteIds.push(note.id);
    // Use the status of the most recently created note as the representative status
    if (note.createdAt > (acc[key].createdAt || 0)) {
        acc[key].status = note.status;
        acc[key].createdAt = note.createdAt;
    }

    return acc;
  }, {} as Record<string, GroupedNote>);

  const handleToggleStatus = (note: GroupedNote) => {
    startTransition(async () => {
      const newStatus = note.status === 'published' ? 'hidden' : 'published';
      // This action needs to update all notes within this group
      const result = await toggleNoteStatusAction(note.noteIds, newStatus);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  const handleDeleteItem = (noteId: string, itemId: string) => {
     startTransition(async () => {
      const result = await deleteNoteItemAction(noteId, itemId);
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
        {/* Edit Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Note Item</DialogTitle>
                </DialogHeader>
                {editingItem && (
                    <NoteItemForm 
                        note={editingItem.note}
                        item={editingItem.item}
                        onSuccess={() => setEditingItem(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
        {/* Add new Item Dialog */}
        <Dialog open={!!addingToNote} onOpenChange={(open) => !open && setAddingToNote(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Note Item to "{addingToNote?.chapter}"</DialogTitle>
                </DialogHeader>
                {addingToNote && (
                    <NoteItemForm 
                        note={addingToNote}
                        onSuccess={() => setAddingToNote(null)}
                    />
                )}
            </DialogContent>
        </Dialog>


      {Object.values(groupedNotes).map((note) => {
        const isOpen = openCollapsibleId === note.id;
        // Find the original note document that a specific item belongs to.
        const findParentNoteForItem = (itemId: string) => notes.find(n => n.items.some(i => i.id === itemId));
        
        return (
          <Collapsible key={note.id} open={isOpen} onOpenChange={(open) => setOpenCollapsibleId(open ? note.id : null)}>
            <Card className={note.status === 'hidden' ? 'bg-muted/50' : ''}>
              <CollapsibleTrigger className="w-full">
                 <CardHeader className="flex flex-row items-center justify-between hover:bg-accent/50 transition-colors rounded-t-lg">
                    <div>
                        <CardTitle className="text-xl text-left">{note.chapter}</CardTitle>
                        <CardDescription className="text-left mt-1">
                            <Badge variant="outline">{note.subjectName} / {note.subcategoryName}</Badge>
                            <span className="ml-2 text-xs">({note.items.length} item{note.items.length === 1 ? '' : 's'})</span>
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
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
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                 </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="border-t pt-4">
                  <div className="space-y-4">
                     {note.items.map((item) => {
                        const parentNote = findParentNoteForItem(item.id);
                        if (!parentNote) return null; // Should not happen

                        return (
                            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-background">
                                <div className="relative w-full md:w-32 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                    <NoteImage
                                        src={item.imageUrl || parentNote.imageUrl}
                                        alt={item.name}
                                        fallbackIcon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-semibold">{item.name}</h4>
                                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                                    <div className="font-semibold text-sm flex gap-4 mt-2">
                                        {item.prices.pdf !== undefined && <p>PDF: ₹{item.prices.pdf}</p>}
                                        {item.prices.printed !== undefined && <p>Printed: ₹{item.prices.printed}</p>}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-2 self-center ml-auto">
                                    <Button variant="outline" size="sm" onClick={() => setEditingItem({ note: parentNote, item })}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isPending}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the "{item.name}" item from "{note.chapter}". This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteItem(parentNote.id, item.id)}
                                                disabled={isPending}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {isPending ? 'Deleting...' : 'Yes, delete it'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        );
                     })}
                     <Button variant="outline" className="w-full" onClick={() => setAddingToNote(note)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Another Note Item to this Chapter
                     </Button>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )
      })}
    </div>
  );
}

