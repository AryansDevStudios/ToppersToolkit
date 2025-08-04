'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Chapter, NoteMaterial } from '@/types';
import { ShoppingCart, IndianRupee } from 'lucide-react';

type ChapterAccordionProps = {
  chapters: Chapter[];
};

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const { toast } = useToast();
  const { addToCart, items } = useCart();

  const handleAddToCart = (material: NoteMaterial) => {
    const cartItem = {
      id: material.id,
      subjectName: material.subjectName,
      chapter: material.chapter,
      type: material.type,
      price: material.price,
    };
    addToCart(cartItem);
    toast({
      title: 'Added to cart!',
      description: `${material.type} for "${material.chapter}" has been added.`,
    });
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No chapters found for this category yet. Stay tuned!</p>
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
              {chapter.materials.map((material) => {
                const isInCart = items.some(item => item.id === material.id);
                return (
                  <div key={material.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-card/50">
                    {material.imageUrl && (
                      <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={material.imageUrl}
                          alt={material.type}
                          fill
                          className="object-cover"
                          data-ai-hint="notes study"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-lg">{material.type}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{material.description}</p>
                       <p className="font-semibold text-lg flex items-center mt-2">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {material.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col justify-center items-center">
                      <Button onClick={() => handleAddToCart(material)} disabled={isInCart} className="w-full md:w-auto">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {isInCart ? 'Added' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
