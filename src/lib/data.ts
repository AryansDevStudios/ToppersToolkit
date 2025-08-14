
import type { Subject, NoteMaterial, Chapter, Order, NoteItem, RecentNoteItem, AdminSettings } from '@/types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { unstable_noStore as noStore } from 'next/cache';


// API-like functions to get data from Firestore
export async function getSubjects(): Promise<Subject[]> {
    // Fallback to hardcoded data if Firestore is empty
    const subjectsData: Subject[] = [
        { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', 'name': 'Biology'}] },
        { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
        { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
        { id: 'english', name: 'English', subcategories: [{id: 'moments', name: 'Moments'}, {id: 'beehive', name: 'Beehive'}, {id: 'grammar', name: 'Grammar'}] },
    ];
    return Promise.resolve(subjectsData);
}

export async function getSubjectById(id: string): Promise<Subject | undefined> {
  // Fallback to hardcoded data if not found in DB
  const subjects = await getSubjects();
  return subjects.find(s => s.id === id);
}

export async function getRecentNotes(count: number = 8): Promise<RecentNoteItem[]> {
    noStore();
    const notesQuery = query(
        collection(db, 'noteMaterials'), 
    );
    const notesSnapshot = await getDocs(notesQuery);
    
    const allItems: RecentNoteItem[] = [];

    notesSnapshot.forEach(doc => {
        const note = doc.data() as NoteMaterial;
        note.id = doc.id; // Assign document id

        if (Array.isArray(note.items)) {
            note.items.forEach(item => {
                if (item.status === 'published') {
                    const findFirstPrice = () => {
                        if (item.prices.pdf !== undefined) return item.prices.pdf;
                        if (item.prices.printed !== undefined) return item.prices.printed;
                        return 0;
                    };
                    
                    const itemCreatedAt = (item.createdAt as Timestamp)?.toDate() ?? (note.createdAt as Timestamp)?.toDate();
                    
                    if (itemCreatedAt) {
                         allItems.push({
                            ...note,
                            createdAt: itemCreatedAt.toISOString(),
                            type: item.name,
                            description: item.description || note.description, // Use item description if available
                            imageUrl: item.imageUrl || note.imageUrl, // Use item image if available
                            price: findFirstPrice(),
                        });
                    }
                }
            });
        }
    });

    // Sort all collected items by date and take the most recent ones
    const sortedItems = allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const recentItems = sortedItems.slice(0, count);

    return JSON.parse(JSON.stringify(recentItems));
}


export async function getAllNotes(): Promise<NoteMaterial[]> {
    noStore();
    const notesQuery = query(collection(db, 'noteMaterials'), orderBy('createdAt', 'desc'));
    const notesSnapshot = await getDocs(notesQuery);
    const notesData = notesSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            ...data, 
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
        } as NoteMaterial
    });
    return JSON.parse(JSON.stringify(notesData));
}


export async function getChaptersForSubcategory(subjectId: string, subcategoryId: string): Promise<Chapter[]> {
    noStore();
    const materialsQuery = query(
        collection(db, 'noteMaterials'), 
        where('subjectId', '==', subjectId), 
        where('subcategoryId', '==', subcategoryId),
    );
    const materialsSnapshot = await getDocs(materialsQuery);
    const materials = materialsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
        } as NoteMaterial
    }).filter(note => {
        // Only include notes that have at least one published item
        return Array.isArray(note.items) && note.items.some(item => item.status === 'published');
    });

    const chaptersMap: { [key: string]: NoteMaterial[] } = {};

    materials.forEach(material => {
        if (!chaptersMap[material.chapter]) {
            chaptersMap[material.chapter] = [];
        }
        chaptersMap[material.chapter].push(material);
    });
    
    const chapters: Chapter[] = Object.entries(chaptersMap).map(([name, materials]) => ({
        name,
        materials,
    }));

    return JSON.parse(JSON.stringify(chapters));
}

export async function getOrders(): Promise<Order[]> {
    noStore();
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const ordersSnapshot = await getDocs(ordersQuery);
    const ordersData = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...(data as Omit<Order, 'id'>), 
            id: doc.id, 
            createdAt: data.createdAt.toDate().toISOString() 
        }
    });
    return JSON.parse(JSON.stringify(ordersData));
}


export async function saveOrder(order: Omit<Order, 'id'>) {
    const ordersCollection = collection(db, 'orders');
    await addDoc(ordersCollection, order);
}

export async function saveNoteMaterial(note: Omit<NoteMaterial, 'id'>) {
    const notesCollection = collection(db, 'noteMaterials');
    await addDoc(notesCollection, {...note, createdAt: Timestamp.now()});
}

export async function updateNoteMaterial(noteId: string, data: Partial<Omit<NoteMaterial, 'id' | 'createdAt'>>) {
    const noteRef = doc(db, 'noteMaterials', noteId);
    await updateDoc(noteRef, data);
}

export async function updateOrderStatus(orderId: string, status: 'new' | 'completed') {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
}

export async function deleteNoteMaterial(noteId: string) {
    const noteRef = doc(db, 'noteMaterials', noteId);
    await deleteDoc(noteRef);
}

export async function getAdminSettings(): Promise<AdminSettings> {
    noStore();
    try {
        const settingsRef = doc(db, 'settings', 'admin');
        const docSnap = await getDoc(settingsRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                passphrase: data.passphrase,
                printPricePerPage: data.printPricePerPage ?? 3.00, // Default price
            };
        }
    } catch (error) {
        console.error("Error fetching admin settings from Firestore:", error);
    }
    
    // Fallback to environment variable if not in Firestore
    if (process.env.ADMIN_PASSPHRASE) {
        return {
            passphrase: process.env.ADMIN_PASSPHRASE,
            printPricePerPage: 3.00, // Default price
        }
    }

    throw new Error("ADMIN_PASSPHRASE is not set. Please set it in your .env file or in Firestore at 'settings/admin'.");
}


export async function getPassphrase(): Promise<string> {
    const settings = await getAdminSettings();
    return settings.passphrase;
}

export async function checkChapterExists({ subjectId, subcategoryId, chapter }: { subjectId: string, subcategoryId: string, chapter: string }): Promise<boolean> {
    noStore();
    const q = query(
        collection(db, 'noteMaterials'),
        where('subjectId', '==', subjectId),
        where('subcategoryId', '==', subcategoryId),
        where('chapter', '==', chapter)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}
