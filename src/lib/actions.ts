'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { CartItem, Subject, SubCategory } from '@/types';

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

    console.log('New Order Placed:');
    console.log('Name:', parsed.name);
    console.log('Class:', parsed.userClass);
    console.log('Instructions:', parsed.instructions);
    console.log('Items:', cartItems);
    
    // Here you would typically save the order to Firestore.
    // e.g., await db.collection('orders').add({ ... });

    revalidatePath('/admin');
    return { success: true, message: 'Order placed successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to place order.' };
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
            type: parsed.noteType,
            description: parsed.description,
            imageUrl: parsed.imageUrl,
            id: crypto.randomUUID(), // For demo purposes
        };

        console.log('New Note Added:', newNote);

        // Here you would save the new note to Firestore
        // e.g., await db.collection('notes').add(newNote);
        
        revalidatePath(`/subjects/${subject.id}/${subcategory.id}`);
        return { success: true, message: 'Note added successfully!' };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to add note.' };
    }
}
