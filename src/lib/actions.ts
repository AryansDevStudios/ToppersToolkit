'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { CartItem, Subject, SubCategory } from '@/types';
import { saveOrder, saveNoteMaterial } from './data';
import { Timestamp } from 'firebase/firestore';

const placeOrderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userClass: z.string().min(1, 'Class is required'),
  instructions: z.string().optional(),
  cartItems: z.string(),
});

export async function placeOrderAction(prevState: any, formData: FormData) {
  try {
    const parsed = placeOrderSchema.parse({
      name: formData.get('name'),
      userClass: formData.get('userClass'),
      instructions: formData.get('instructions'),
      cartItems: formData.get('cartItems'),
    });

    const cartItems: CartItem[] = JSON.parse(parsed.cartItems);

    const newOrder = {
        name: parsed.name,
        userClass: parsed.userClass,
        instructions: parsed.instructions,
        items: cartItems,
        createdAt: Timestamp.now(),
    };
    
    await saveOrder(newOrder);

    revalidatePath('/admin');
    return { success: true, message: 'Order placed successfully!' };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to place order.';
    return { success: false, message };
  }
}

const addNoteSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    chapterName: z.string().min(1, 'Chapter name is required'),
    noteType: z.string().min(1, 'Note type is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function addNoteAction(prevState: any, formData: FormData) {
    try {
        const parsed = addNoteSchema.parse({
            subject: formData.get('subject'),
            subcategory: formData.get('subcategory'),
            chapterName: formData.get('chapterName'),
            noteType: formData.get('noteType'),
            description: formData.get('description'),
            imageUrl: formData.get('imageUrl'),
        });

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const newNote = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            type: parsed.noteType as any,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://placehold.co/600x400',
            isFeatured: false,
        };

        await saveNoteMaterial(newNote);
        
        revalidatePath(`/subjects/${subject.id}/${subcategory.id}`);
        revalidatePath('/'); // for featured notes if logic changes
        return { success: true, message: 'Note added successfully!' };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to add note.';
        return { success: false, message };
    }
}
