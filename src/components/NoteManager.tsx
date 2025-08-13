
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
    deleteNoteItemAction,
    updateNoteItemStatusAction,
    migrateNotesAction
} from '@/lib/actions';
import type { NoteMaterial, NoteItem } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Eye, EyeOff, ChevronDown, BookOpen, PlusCircle, FilePenLine, DatabaseZap, AlertCircle } from 'lucide-react';
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
import { NoteImage } from './NoteImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NoteItemForm } from './NoteItemForm';
import { ChapterEditForm } from './ChapterEditForm';
import { Separator } from './ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


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
  const [migrationState, setMigrationState] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [openCollapsibleId, setOpenCollapsibleId] = useState<string | null>(null);
  
  // State for dialogs
  const [editingItem, setEditingItem] = useState<{ note: NoteMaterial, item: NoteItem } | null>(null);
  const [addingToNote, setAddingToNote] = useState<NoteMaterial | null>(null);
  const [editingChapter, setEditingChapter] = useState<GroupedNote | null>(null);


  const groupedByChapter = notes.reduce((acc, note) => {
    const key = `${note.subjectId}-${note.subcategoryId}-${note.chapter}`;
    if (!acc[key]) {
      acc[key] = {
        ...note,
        items: [],
        noteIds: [],
      };
    }
    
    if (Array.isArray(note.items)) {
        acc[key].items.push(...note.items);
    }
    acc[key].noteIds.push(note.id);
    
    if (!acc[key].createdAt || note.createdAt > acc[key].createdAt) {
        acc[key].createdAt = note.createdAt;
        acc[key].description = note.description;
        acc[key].imageUrl = note.imageUrl;
    }

    return acc;
  }, {} as Record<string, GroupedNote>);

  const chapters = Object.values(groupedByChapter);

  const groupedBySubjectAndSubcategory = chapters.reduce((acc, chapter) => {
    const { subjectName, subcategoryName } = chapter;
    if (!acc[subjectName]) {
        acc[subjectName] = {};
    }
    if (!acc[subjectName][subcategoryName]) {
        acc[subjectName][subcategoryName] = [];
    }
    acc[subjectName][subcategoryName].push(chapter);
    acc[subjectName][subcategoryName].sort((a, b) => (b.createdAt as string).localeCompare(a.createdAt as string));
    return acc;
  }, {} as Record<string, Record<string, GroupedNote[]>>);


  const handleToggleItemStatus = (noteId: string, itemId: string, newStatus: 'published' | 'hidden') => {
    startTransition(async () => {
      const result = await updateNoteItemStatusAction(noteId, itemId, newStatus);
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
  
  const handleMigration = () => {
    startTransition(async () => {
        setMigrationState(null);
        const result = await migrateNotesAction();
        if (result.success) {
            setMigrationState({ type: 'success', message: result.message });
            toast({ title: 'Migration Complete', description: result.message });
            router.refresh();
        } else {
            setMigrationState({ type: 'error', message: result.message });
            toast({ title: 'Migration Failed', description: result.message, variant: 'destructive' });
        }
    });
  }


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
  
  const findParentNoteForItem = (itemId: string) => notes.find(n => Array.isArray(n.items) && n.items.some(i => i.id === itemId));

  return (
    <div>
        {/* Dialogs */}
        <Dialog open={!!editingChapter} onOpenChange={(open) => !open && setEditingChapter(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Chapter Information</DialogTitle>
                </DialogHeader>
                {editingChapter && (
                    <ChapterEditForm 
                        chapter={editingChapter}
                        onSuccess={() => setEditingChapter(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
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

        <Card>
            <CardHeader>
                <CardTitle>Note Manager</CardTitle>
                <CardDescription>
                Manage all uploaded chapters, grouped by subject and sub-category.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {/* Migration Section */}
                <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold">Data Migration</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Use this one-time utility to update all old note items to the new data format which includes a creation timestamp.
                    </p>
                    
                    {migrationState && (
                        <Alert variant={migrationState.type === 'error' ? 'destructive' : 'default'} className="mb-4 bg-background">
                             <AlertCircle className="h-4 w-4" />
                             <AlertTitle>{migrationState.type === 'error' ? 'Migration Failed' : 'Migration Result'}</AlertTitle>
                             <AlertDescription>{migrationState.message}</AlertDescription>
                        </Alert>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">
                                <DatabaseZap className="mr-2 h-4 w-4" />
                                Migrate Old Notes to New Format
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Data Migration</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will scan all your notes and add a `createdAt` timestamp to any items that are missing one. This action is safe to run multiple times, but is only necessary once. Are you sure you want to proceed?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMigration} disabled={isPending}>
                                    {isPending ? 'Migrating...' : 'Yes, start migration'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                {Object.entries(groupedBySubjectAndSubcategory).map(([subjectName, subcategories]) => (
                    <div key={subjectName} className="space-y-4">
                        <h2 className="text-2xl font-bold font-headline tracking-tight">{subjectName}</h2>
                        <div className="space-y-4 pl-4 border-l-2">
                            {Object.entries(subcategories).map(([subcategoryName, chapters]) => (
                                <div key={subcategoryName}>
                                    <h3 className="text-lg font-semibold text-muted-foreground">{subcategoryName}</h3>
                                    <div className="space-y-2 mt-2">
                                        {chapters.map((note) => {
                                            const isOpen = openCollapsibleId === note.id;
                                            return (
                                                <Collapsible key={note.id} onOpenChange={() => setOpenCollapsibleId(isOpen ? null : note.id)} open={isOpen} asChild>
                                                    <div className="rounded-lg border">
                                                        <div className="flex items-center p-2 pr-4">
                                                            <CollapsibleTrigger asChild>
                                                                <Button variant="ghost" className="flex-grow justify-between h-auto py-2 px-3 hover:bg-muted/50">
                                                                    <div className="flex-grow text-left">
                                                                        <p className="font-semibold text-base">{note.chapter}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            ({note.items.length} item{note.items.length === 1 ? '' : 's'})
                                                                        </p>
                                                                    </div>
                                                                    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''} ml-4 flex-shrink-0`} />
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                            <Button variant="ghost" size="icon" className="ml-2 flex-shrink-0" onClick={() => setEditingChapter(note)}>
                                                                <FilePenLine className="h-4 w-4" />
                                                                <span className="sr-only">Edit Chapter</span>
                                                            </Button>
                                                        </div>
                                                        <CollapsibleContent>
                                                            <div className="border-t p-4 space-y-4 bg-muted/20">
                                                                {note.items.map((item) => {
                                                                    const parentNote = findParentNoteForItem(item.id);
                                                                    if (!parentNote) return null;

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
                                                                            <div className="flex flex-col items-end justify-between gap-2">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Label htmlFor={`status-${item.id}`} className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                                        {item.status === 'published' ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                                                                                    </Label>
                                                                                    <Switch 
                                                                                        id={`status-${item.id}`} 
                                                                                        checked={item.status === 'published'}
                                                                                        onCheckedChange={(checked) => handleToggleItemStatus(parentNote.id, item.id, checked ? 'published' : 'hidden')}
                                                                                        disabled={isPending}
                                                                                    />
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
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
                                                                        </div>
                                                                    );
                                                                })}
                                                                <Button variant="outline" className="w-full" onClick={() => setAddingToNote(note)}>
                                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Another Note Item to this Chapter
                                                                </Button>
                                                            </div>
                                                        </CollapsibleContent>
                                                    </div>
                                                </Collapsible>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}

    
