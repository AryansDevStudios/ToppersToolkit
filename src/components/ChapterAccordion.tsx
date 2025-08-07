
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
import type { Chapter, NoteMaterial, PriceInfo } from '@/types';
import { ShoppingCart, IndianRupee } from 'lucide-react';

type ChapterAccordionProps = {
  chapters: Chapter[];
};

type MaterialDisplayInfo = {
  type: 'Handwritten Notes' | 'Typed Notes' | 'Question Bank';
  prices?: PriceInfo;
};

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const { toast } = useToast();
  const { addToCart, items } = useCart();

  const handleAddToCart = (
    note: NoteMaterial,
    type: 'Handwritten Notes' | 'Typed Notes' | 'Question Bank',
    prices: PriceInfo
  ) => {
    // Default to PDF if available, otherwise Printed
    const initialFormat = prices.pdf !== undefined ? 'PDF' : 'Printed';
    const initialPrice = initialFormat === 'PDF' ? prices.pdf! : prices.printed!;

    const cartItem = {
      id: `${note.id}-${type.replace(/\s+/g, '-')}`, // e.g., 'xyz-Handwritten-Notes'
      noteId: note.id,
      subjectName: note.subjectName,
      chapter: note.chapter,
      type: type,
      price: initialPrice,
      prices: prices,
      selectedFormat: initialFormat,
    };
    addToCart(cartItem);
    toast({
      title: 'Added to cart!',
      description: `${type} for "${note.chapter}" has been added.`,
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
              {chapter.materials.map((note) => {
                const availableMaterials: MaterialDisplayInfo[] = [
                  { type: 'Handwritten Notes', prices: note.prices.handwritten },
                  { type: 'Typed Notes', prices: note.prices.typed },
                  { type: 'Question Bank', prices: note.prices.questionBank },
                ];

                return availableMaterials
                  .filter(material => material.prices?.pdf !== undefined || material.prices?.printed !== undefined)
                  .map(material => {
                    const cartItemId = `${note.id}-${material.type.replace(/\s+/g, '-')}`;
                    const isInCart = items.some(item => item.id === cartItemId);
                    const validImageUrl = note.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true';
                    
                    return (
                      <div key={cartItemId} className="flex flex-col md:flex-row flex-wrap gap-4 p-4 rounded-lg border bg-card/50">
                        {note.imageUrl && (
                          <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-md overflow-hidden">
                            <img
                              src={validImageUrl}
                              alt={note.chapter}
                              className="w-full h-full object-cover"
                              data-ai-hint="notes study"
                              onError={(e) => { e.currentTarget.src = 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true'; }}
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h4 className="font-semibold text-lg">{material.type}</h4>
                          <p className="text-muted-foreground text-sm mt-1">{note.description}</p>
                           <div className="flex items-end gap-4 mt-2">
                            {material.prices?.pdf !== undefined && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">PDF</span>
                                    <p className="font-semibold text-lg flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {material.prices.pdf.toFixed(2)}
                                    </p>
                                </div>
                            )}
                             {material.prices?.printed !== undefined && (
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Printed</span>
                                    <p className="font-semibold text-lg flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-1" />
                                        {material.prices.printed.toFixed(2)}
                                    </p>
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col justify-center items-center">
                          <Button onClick={() => handleAddToCart(note, material.type, material.prices!)} disabled={isInCart} className="w-full md:w-auto">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isInCart ? 'Added' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
