
import type { Subject, NoteMaterial, Chapter, Order } from '@/types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';


// API-like functions to get data from Firestore
export async function getSubjects(): Promise<Subject[]> {
    // Fallback to hardcoded data if Firestore is empty
    const subjectsData: Subject[] = [
        { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
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

export async function getRecentNotes(count: number = 8): Promise<NoteMaterial[]> {
    const notesQuery = query(
        collection(db, 'noteMaterials'), 
        orderBy('createdAt', 'desc'), 
        limit(count * 2) // Fetch more to account for filtering
    );
    const notesSnapshot = await getDocs(notesQuery);
    const notesData =  notesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
        } as NoteMaterial
    }).filter(note => note.status === 'published')
      .slice(0, count);

    return JSON.parse(JSON.stringify(notesData));
}

export async function getAllNotes(): Promise<NoteMaterial[]> {
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
    const materialsQuery = query(
        collection(db, 'noteMaterials'), 
        where('subjectId', '==', subjectId), 
        where('subcategoryId', '==', subcategoryId),
        where('status', '==', 'published')
    );
    const materialsSnapshot = await getDocs(materialsQuery);
    const materials = materialsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toISOString(),
        } as NoteMaterial
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

export async function updateNoteMaterial(noteId: string, data: Partial<NoteMaterial>) {
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

export async function getPassphrase(): Promise<string> {
    try {
        const settingsRef = doc(db, 'settings', 'admin');
        const docSnap = await getDoc(settingsRef);

        if (docSnap.exists() && docSnap.data().passphrase) {
            return docSnap.data().passphrase;
        }
    } catch (error) {
        console.error("Error fetching passphrase from Firestore:", error);
    }
    
    // Fallback to environment variable if not in Firestore
    if (process.env.ADMIN_PASSPHRASE) {
        return process.env.ADMIN_PASSPHRASE;
    }

    throw new Error("ADMIN_PASSPHRASE is not set. Please set it in your .env file or in Firestore at 'settings/admin'.");
}
