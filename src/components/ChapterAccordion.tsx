
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Chapter, NoteMaterial, NoteItem, PriceInfo } from '@/types';
import { ShoppingCart, IndianRupee } from 'lucide-react';

type ChapterAccordionProps = {
  chapters: Chapter[];
};

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const { toast } = useToast();
  const { addToCart, items } = useCart();

  const handleAddToCart = (
    note: NoteMaterial,
    noteItem: NoteItem,
  ) => {
    // Default to PDF if available, otherwise Printed
    const initialFormat = noteItem.prices.pdf !== undefined ? 'PDF' : 'Printed';
    const initialPrice = initialFormat === 'PDF' ? noteItem.prices.pdf! : noteItem.prices.printed!;

    const cartItem = {
      id: `${note.id}-${noteItem.id}`, // e.g., 'chapterNoteId-summary-item'
      noteId: note.id,
      noteItemId: noteItem.id,
      subjectName: note.subjectName,
      chapter: note.chapter,
      type: noteItem.name,
      price: initialPrice,
      prices: noteItem.prices,
      selectedFormat: initialFormat,
    };

    addToCart(cartItem);
    toast({
      title: 'Added to cart!',
      description: `${noteItem.name} for "${note.chapter}" has been added.`,
    });
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No materials found for this category yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.name} value={chapter.name}>
          <AccordionTrigger className="text-xl font-headline hover:no-underline">
            {chapter.name}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {chapter.materials.map((note) => (
                note.items
                  .filter(item => item.prices.pdf !== undefined || item.prices.printed !== undefined)
                  .map(noteItem => {
                    const cartItemId = `${note.id}-${noteItem.id}`;
                    const isInCart = items.some(item => item.id === cartItemId);
                    
                    const itemImage = noteItem.imageUrl || note.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true';

                    return (
                      <div key={cartItemId} className="flex flex-col md:flex-row flex-wrap gap-4 p-4 rounded-lg border bg-card/50">
                        <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-md overflow-hidden">
                          <img
                            src={itemImage}
                            alt={note.chapter}
                            className="w-full h-full object-cover"
                            data-ai-hint="notes study"
                            onError={(e) => { e.currentTarget.src = 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true'; }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-lg">{noteItem.name}</h4>
                          <p className="text-muted-foreground text-sm mt-1">{noteItem.description || note.description}</p>
                           <div className="flex items-end gap-4 mt-2">
                            {noteItem.prices?.pdf !== undefined && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">PDF</span>
                                    <p className="font-semibold text-lg flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {noteItem.prices.pdf.toFixed(2)}
                                    </p>
                                </div>
                            )}
                             {noteItem.prices?.printed !== undefined && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Printed</span>
                                    <p className="font-semibold text-lg flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {noteItem.prices.printed.toFixed(2)}
                                    </p>
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col justify-center items-center">
                          <Button onClick={() => handleAddToCart(note, noteItem)} disabled={isInCart} className="w-full md:w-auto">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isInCart ? 'Added' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
