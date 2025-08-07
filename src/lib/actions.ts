
'use server';

import { z } from 'zod';
import { CartItem, Subject, SubCategory, NoteMaterial, NotePrices } from '@/types';
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
    return { success: false, message };
  }
}

const PriceSchema = z.coerce.number().min(0).optional();

const addNoteSchema = z.object({
    subject: z.string().min(1, 'Subject is required'),
    subcategory: z.string().min(1, 'Subcategory is required'),
    chapterName: z.string().min(1, 'Chapter name is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url().optional().or(z.literal('')),
    priceHandwrittenPDF: PriceSchema,
    priceHandwrittenPrinted: PriceSchema,
    priceTypedPDF: PriceSchema,
    priceTypedPrinted: PriceSchema,
    priceQuestionBankPDF: PriceSchema,
    priceQuestionBankPrinted: PriceSchema,
});

export async function addNoteAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const parsed = addNoteSchema.parse(Object.fromEntries(formData.entries()));

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const prices: NotePrices = {
            handwritten: {
                pdf: parsed.priceHandwrittenPDF,
                printed: parsed.priceHandwrittenPrinted,
            },
            typed: {
                pdf: parsed.priceTypedPDF,
                printed: parsed.priceTypedPrinted,
            },
            questionBank: {
                pdf: parsed.priceQuestionBankPDF,
                printed: parsed.priceQuestionBankPrinted,
            }
        };

        const newNote: Omit<NoteMaterial, 'id' | 'createdAt'> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            status: 'published',
            prices: prices,
        };

        await saveNoteMaterial(newNote);
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        
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
    noStore();
    try {
        const parsed = updateNoteSchema.parse(Object.fromEntries(formData.entries()));

        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const prices: NotePrices = {
            handwritten: {
                pdf: parsed.priceHandwrittenPDF,
                printed: parsed.priceHandwrittenPrinted,
            },
            typed: {
                pdf: parsed.priceTypedPDF,
                printed: parsed.priceTypedPrinted,
            },
            questionBank: {
                pdf: parsed.priceQuestionBankPDF,
                printed: parsed.priceQuestionBankPrinted,
            }
        };

        const updatedData: Partial<NoteMaterial> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            description: parsed.description,
            imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
            prices: prices,
        };

        await updateNoteMaterial(parsed.noteId, updatedData);
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        
        return { success: true, message: 'Note updated successfully!' };

    } catch (error) {
        console.error(error);
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

export async function deleteNoteAction(noteId: string, subjectId: string, subcategoryId: string) {
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

export async function toggleNoteStatusAction(noteId: string, currentStatus: 'published' | 'hidden', subjectId: string, subcategoryId: string) {
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
