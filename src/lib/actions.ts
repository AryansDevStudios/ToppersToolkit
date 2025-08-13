
'use server';

import { z } from 'zod';
import { CartItem, Subject, SubCategory, NoteMaterial, NoteItem } from '@/types';
import { db } from './firebase';
import { saveOrder, saveNoteMaterial, updateOrderStatus, updateNoteMaterial } from './data';
import { Timestamp, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where, writeBatch, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { nanoid } from 'nanoid';


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

// Allow empty string or a string that can be coerced to a non-negative number
const PriceSchema = z.string().refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: 'Price must be a non-negative number or empty.',
}).optional();

const NoteItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Note type name is required.'),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
    pricePDF: PriceSchema,
    pricePrinted: PriceSchema,
}).refine(data => data.pricePDF || data.pricePrinted, {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});


const NoteFormSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string(), // Not required for existing chapters
  imageUrl: z.string().url({ message: 'Please enter a valid main image URL.' }).optional().or(z.literal('')),
  items: z.string(), // This will be a JSON string
});


const parseAndTransformNoteItems = (itemsJSON: string): NoteItem[] => {
    const parsedItemsForValidation = z.array(NoteItemSchema).min(1, 'You must add at least one note type.').parse(JSON.parse(itemsJSON));
    
    return parsedItemsForValidation.map(item => {
        const prices: { pdf?: number; printed?: number } = {};
        if (item.pricePDF) {
            prices.pdf = parseFloat(item.pricePDF);
        }
        if (item.pricePrinted) {
            prices.printed = parseFloat(item.pricePrinted);
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            imageUrl: item.imageUrl || '',
            prices: prices,
            status: 'published', // Default status
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

        // Check if a note with the same chapter name and path already exists
        const q = query(
            collection(db, 'noteMaterials'),
            where('subjectId', '==', subject.id),
            where('subcategoryId', '==', subcategory.id),
            where('chapter', '==', parsed.chapterName)
        );

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // It exists, update the first found document with the new items
            const existingNoteDoc = querySnapshot.docs[0];
            await updateNoteMaterial(existingNoteDoc.id, {
                items: arrayUnion(...noteItems)
            });
             return { success: true, message: `Added new items to existing chapter: ${parsed.chapterName}` };
        } else {
            // It does not exist, create a new document
            if (!parsed.description) {
                throw new Error("Description is required for new chapters.");
            }
            const newNote: Omit<NoteMaterial, 'id' | 'createdAt'> = {
                subjectId: subject.id,
                subjectName: subject.name,
                subcategoryId: subcategory.id,
                subcategoryName: subcategory.name,
                chapter: parsed.chapterName,
                description: parsed.description,
                imageUrl: parsed.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true',
                items: noteItems,
            };

            await saveNoteMaterial(newNote);
            return { success: true, message: 'Note added successfully!' };
        }

    } catch (error) {
        console.error("Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to add note.';
        return { success: false, message };
    } finally {
        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
    }
}

export async function deleteNoteItemAction(noteId: string, itemId: string) {
    noStore();
    try {
        const noteRef = doc(db, 'noteMaterials', noteId);
        const noteSnapshot = await getDoc(noteRef);
        if (!noteSnapshot.exists()) {
            throw new Error('Note document not found.');
        }
        
        const noteData = noteSnapshot.data() as NoteMaterial;
        const updatedItems = noteData.items.filter(item => item.id !== itemId);
        
        // If this was the last item, delete the whole document
        if (updatedItems.length === 0) {
            await deleteDoc(noteRef);
        } else {
            await updateDoc(noteRef, { items: updatedItems });
        }

        revalidatePath('/');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/admin');
        return { success: true, message: 'Note item deleted successfully.' };
    } catch (error) {
        console.error("Action Error:", error);
        const message = error instanceof Error ? error.message : 'Failed to delete note item.';
        return { success: false, message };
    }
}


export async function updateNoteItemStatusAction(noteId: string, itemId: string, newStatus: 'published' | 'hidden') {
    noStore();
    try {
        const noteRef = doc(db, "noteMaterials", noteId);
        const noteSnapshot = await getDoc(noteRef);
        if (!noteSnapshot.exists()) {
            throw new Error("Note not found");
        }
        const noteData = noteSnapshot.data() as NoteMaterial;
        const updatedItems = noteData.items.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
        );
        await updateDoc(noteRef, { items: updatedItems });

        revalidatePath('/admin');
        revalidatePath('/subjects', 'layout');
        return { success: true, message: `Item status updated to ${newStatus}.` };
    } catch (error) {
        console.error("Action Error:", error);
        return { success: false, message: 'Failed to update item status.' };
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

const ItemFormSchema = z.object({
  noteId: z.string().min(1),
  itemId: z.string().min(1),
  name: z.string().min(1, 'Note type name is required.'),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  pricePDF: PriceSchema,
  pricePrinted: PriceSchema,
  status: z.enum(['published', 'hidden']),
}).refine(data => data.pricePDF || data.pricePrinted, {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});

export async function updateNoteItemAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const rawData = Object.fromEntries(formData.entries());
        const parsed = ItemFormSchema.parse(rawData);

        const noteRef = doc(db, 'noteMaterials', parsed.noteId);
        const noteSnapshot = await getDoc(noteRef);
        if (!noteSnapshot.exists()) {
            throw new Error('Note document not found.');
        }
        
        const noteData = noteSnapshot.data() as NoteMaterial;
        const itemIndex = noteData.items.findIndex(item => item.id === parsed.itemId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in note.');
        }

        const prices: { pdf?: number; printed?: number } = {};
        if (parsed.pricePDF) { prices.pdf = parseFloat(parsed.pricePDF); }
        if (parsed.pricePrinted) { prices.printed = parseFloat(parsed.pricePrinted); }

        const updatedItem: NoteItem = {
            id: parsed.itemId,
            name: parsed.name,
            description: parsed.description || '',
            imageUrl: parsed.imageUrl || '',
            prices: prices,
            status: parsed.status,
        };

        const updatedItems = [...noteData.items];
        updatedItems[itemIndex] = updatedItem;

        await updateDoc(noteRef, { items: updatedItems });

        revalidatePath('/admin');
        return { success: true, message: 'Note item updated successfully.' };
    } catch (error) {
        console.error("Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to update note item.';
        return { success: false, message };
    }
}

const AddItemFormSchema = z.object({
  noteId: z.string().min(1),
  name: z.string().min(1, 'Note type name is required.'),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
  pricePDF: PriceSchema,
  pricePrinted: PriceSchema,
  status: z.enum(['published', 'hidden']),
}).refine(data => data.pricePDF || data.pricePrinted, {
    message: 'At least one price (PDF or Printed) is required.',
    path: ['name'],
});

export async function addNoteItemAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const rawData = Object.fromEntries(formData.entries());
        const parsed = AddItemFormSchema.parse(rawData);

        const prices: { pdf?: number; printed?: number } = {};
        if (parsed.pricePDF) { prices.pdf = parseFloat(parsed.pricePDF); }
        if (parsed.pricePrinted) { prices.printed = parseFloat(parsed.pricePrinted); }

        const newItem: NoteItem = {
            id: nanoid(),
            name: parsed.name,
            description: parsed.description || '',
            imageUrl: parsed.imageUrl || '',
            prices: prices,
            status: parsed.status,
        };

        await updateNoteMaterial(parsed.noteId, {
            items: arrayUnion(newItem)
        });

        revalidatePath('/admin');
        return { success: true, message: 'New note item added successfully.' };
    } catch (error) {
        console.error("Action Error:", error);
         if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to add note item.';
        return { success: false, message };
    }
}


const ChapterEditSchema = z.object({
  noteIds: z.string().transform(ids => ids.split(',')),
  subject: z.string().min(1, 'Please select a subject'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }).optional().or(z.literal('')),
});

export async function updateChapterInfoAction(prevState: any, formData: FormData) {
    noStore();
    try {
        const rawData = Object.fromEntries(formData.entries());
        const parsed = ChapterEditSchema.parse(rawData);
        const subject: Subject = JSON.parse(parsed.subject);
        const subcategory: SubCategory = JSON.parse(parsed.subcategory);

        const batch = writeBatch(db);
        const updateData: Partial<NoteMaterial> = {
            subjectId: subject.id,
            subjectName: subject.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            chapter: parsed.chapterName,
            description: parsed.description,
        };
        if (parsed.imageUrl) {
            updateData.imageUrl = parsed.imageUrl;
        }

        parsed.noteIds.forEach(id => {
            const noteRef = doc(db, 'noteMaterials', id);
            batch.update(noteRef, updateData);
        });
        
        await batch.commit();

        revalidatePath('/admin');
        revalidatePath('/subjects', 'layout');
        revalidatePath('/');
        return { success: true, message: 'Chapter information updated successfully.' };
    } catch (error) {
        console.error("Action Error:", error);
         if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }
        const message = error instanceof Error ? error.message : 'Failed to update chapter.';
        return { success: false, message };
    }
}

    