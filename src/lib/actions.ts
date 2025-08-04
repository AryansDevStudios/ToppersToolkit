
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { CartItem, Subject, SubCategory, NoteMaterial } from '@/types';
import { saveOrder, saveNoteMaterial, updateOrderStatus, deleteNoteMaterial, updateNoteMaterial } from './data';
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
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);


    const newOrder = {
        name: parsed.name,
        userClass: parsed.userClass,
        instructions: parsed.instructions,
        items: cartItems,
        createdAt: Timestamp.now(),
        status: 'new' as const,
        totalPrice,
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
    price: z.coerce.number().min(0, 'Price must be a positive number'),
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
            price: formData.get('price'),
        });

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const newNote: Omit<NoteMaterial, 'id' | 'createdAt'> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            type: parsed.noteType as any,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            status: 'published',
            price: parsed.price,
        };

        await saveNoteMaterial(newNote);
        
        revalidatePath(`/subjects/${subject.id}/${subcategory.id}`);
        revalidatePath('/'); // for recent notes
        revalidatePath('/admin'); // for note manager
        return { success: true, message: 'Note added successfully!' };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to add note.';
        return { success: false, message };
    }
}

const updateNoteSchema = addNoteSchema.extend({
    noteId: z.string().min(1),
});

export async function updateNoteAction(prevState: any, formData: FormData) {
    try {
        const parsed = updateNoteSchema.parse({
            noteId: formData.get('noteId'),
            subject: formData.get('subject'),
            subcategory: formData.get('subcategory'),
            chapterName: formData.get('chapterName'),
            noteType: formData.get('noteType'),
            description: formData.get('description'),
            imageUrl: formData.get('imageUrl'),
            price: formData.get('price'),
        });

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const updatedData: Partial<NoteMaterial> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            type: parsed.noteType as any,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            price: parsed.price,
        };

        await updateNoteMaterial(parsed.noteId, updatedData);
        
        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath(`/subjects/${subject.id}/${subcategory.id}`);
        
        return { success: true, message: 'Note updated successfully!' };

    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to update note.';
        return { success: false, message };
    }
}


export async function completeOrderAction(orderId: string) {
    try {
        await updateOrderStatus(orderId, 'completed');
        revalidatePath('/admin');
        return { success: true, message: 'Order marked as complete.' };
    } catch (error) {
        return { success: false, message: 'Failed to update order.' };
    }
}

export async function deleteNoteAction(noteId: string) {
    try {
        await deleteNoteMaterial(noteId);
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, message: 'Note deleted.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete note.' };
    }
}

export async function toggleNoteStatusAction(noteId: string, currentStatus: 'published' | 'hidden') {
    try {
        const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
        await updateNoteMaterial(noteId, { status: newStatus });
        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, message: `Note status updated to ${newStatus}.` };
    } catch (error) {
        return { success: false, message: 'Failed to update note status.' };
    }
}
