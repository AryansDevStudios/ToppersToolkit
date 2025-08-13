
'use server';

import { z } from 'zod';
import { CartItem, Subject, SubCategory, NoteMaterial, NoteItem } from '@/types';
import { saveOrder, saveNoteMaterial, updateOrderStatus, deleteNoteMaterial, updateNoteMaterial } from './data';
import { Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

const placeOrderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  userClass: z.string().min(1, 'Class is required'),
  instructions: z.string().optional(),
  cartItems: z.string(),
  paymentMethod: z.enum(['COD', 'UPI'], { required_error: 'Please select a payment method' }),
  terms: z.literal('on', { errorMap: () => ({ message: 'You must agree to the Terms and Conditions' }) }),
});

export async function placeOrderAction(prevState: any, formData: FormData) {
  noStore();
  try {
    const parsed = placeOrderSchema.parse({
      name: formData.get('name'),
      userClass: formData.get('userClass'),
      instructions: formData.get('instructions'),
      cartItems: formData.get('cartItems'),
      paymentMethod: formData.get('paymentMethod'),
      terms: formData.get('terms'),
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
        paymentMethod: parsed.paymentMethod,
    };
    
    await saveOrder(newOrder);
    revalidatePath('/admin');

    return { success: true, message: 'Order placed successfully!' };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Failed to place order.';
    if (error instanceof z.ZodError) {
        return { success: false, message: error.errors[0].message };
    }
    return { success: false, message };
  }
}

const PriceSchema = z.coerce.number().min(0, 'Price must be non-negative').optional().or(z.literal(''));

const NoteItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Note type name is required.'),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
    pricePDF: PriceSchema,
    pricePrinted: PriceSchema,
}).refine(data => (data.pricePDF !== undefined && data.pricePDF !== '') || (data.pricePrinted !== undefined && data.pricePrinted !== ''), {
    message: 'At least one price (PDF or Printed) is required for this note type.',
    path: ['name'], // Attach error to the name field of the item
});


const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string().min(1, 'A main description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid main image URL.' }).optional().or(z.literal('')),
  items: z.string(), // This will be a JSON string
});


const parseAndTransformNoteItems = (itemsJSON: string): NoteItem[] => {
    const parsedItemsForValidation = z.array(NoteItemSchema).min(1, 'You must add at least one note type.').parse(JSON.parse(itemsJSON));
    
    return parsedItemsForValidation.map(item => {
        const prices: { pdf?: number; printed?: number } = {};
        if (item.pricePDF !== undefined && item.pricePDF !== '') {
            prices.pdf = Number(item.pricePDF);
        }
        if (item.pricePrinted !== undefined && item.pricePrinted !== '') {
            prices.printed = Number(item.pricePrinted);
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            imageUrl: item.imageUrl || '',
            prices: prices,
        };
    });
};

export async function addNoteAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const rawData = Object.fromEntries(formData.entries());
        const parsed = NoteFormSchema.parse(rawData);

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);
        const noteItems = parseAndTransformNoteItems(parsed.items);

        const newNote: Omit<NoteMaterial, 'id' | 'createdAt'> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            status: 'published',
            items: noteItems,
        };

        await saveNoteMaterial(newNote);
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        
        return { success: true, message: 'Note added successfully!' };

    } catch (error) {
        console.error("Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to add note.';
        return { success: false, message };
    }
}

const updateNoteSchema = NoteFormSchema.extend({
    noteId: z.string().min(1),
});

export async function updateNoteAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const rawData = Object.fromEntries(formData.entries());
        const parsed = updateNoteSchema.parse(rawData);

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);
        const noteItems = parseAndTransformNoteItems(parsed.items);

        const updatedData: Partial<NoteMaterial> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            items: noteItems,
        };

        await updateNoteMaterial(parsed.noteId, updatedData);
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        
        return { success: true, message: 'Note updated successfully!' };

    } catch (error) {
        console.error("Action Error:", error);
         if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to update note.';
        return { success: false, message };
    }
}


export async function completeOrderAction(orderId: string) {
    noStore();
    try {
        await updateOrderStatus(orderId, 'completed');
        revalidatePath('/admin');
        return { success: true, message: 'Order marked as complete.' };
    } catch (error) {
        return { success: false, message: 'Failed to update order.' };
    }
}

export async function deleteNoteAction(noteId: string) {
    noStore();
    try {
        await deleteNoteMaterial(noteId);
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        return { success: true, message: 'Note deleted.' };
    } catch (error) {
        return { success: false, message: 'Failed to delete note.' };
    }
}

export async function toggleNoteStatusAction(noteId: string, currentStatus: 'published' | 'hidden') {
    noStore();
    try {
        const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
        await updateNoteMaterial(noteId, { status: newStatus });
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        return { success: true, message: `Note status updated to ${newStatus}.` };
    } catch (error) {
        return { success: false, message: 'Failed to update note status.' };
    }
}
