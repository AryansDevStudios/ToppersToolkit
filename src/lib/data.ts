import type { Subject, NoteMaterial, Chapter, Order } from '@/types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';


// API-like functions to get data from Firestore
export async function getSubjects(): Promise<Subject[]> {
    const subjectsData: Subject[] = [
        { id: 'science', name: 'Science', subcategories: [{id: 'physics', name: 'Physics'}, {id: 'chemistry', name: 'Chemistry'}, {id: 'biology', name: 'Biology'}] },
        { id: 'sst', name: 'SST', subcategories: [{id: 'history', name: 'History'}, {id: 'civics', name: 'Civics'}, {id: 'geography', name: 'Geography'}, {id: 'economics', name: 'Economics'}] },
        { id: 'maths', name: 'Maths', subcategories: [{id: 'maths', name: 'Maths'}] },
        { id: 'english', name: 'English', subcategories: [{id: 'literature', name: 'Literature'}, {id: 'grammar', name: 'Grammar'}] },
    ];
    // This is a temporary solution to ensure the app is functional.
    // In a real-world scenario, you would fetch this from Firestore.
    // For now, we will return the hardcoded data.
    return Promise.resolve(subjectsData);
}

export async function getSubjectById(id: string): Promise<Subject | undefined> {
  // Fallback to hardcoded data if not found in DB
  const subjects = await getSubjects();
  return subjects.find(s => s.id === id);
}

export async function getRecentNotes(count: number = 8): Promise<NoteMaterial[]> {
    const notesQuery = query(collection(db, 'noteMaterials'), orderBy('createdAt', 'desc'), limit(count));
    const notesSnapshot = await getDocs(notesQuery);
    const notesData =  notesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as NoteMaterial));
    return JSON.parse(JSON.stringify(notesData));
}

export async function getAllNotes(): Promise<NoteMaterial[]> {
    const notesQuery = query(collection(db, 'noteMaterials'), orderBy('createdAt', 'desc'));
    const notesSnapshot = await getDocs(notesQuery);
    const notesData = notesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as NoteMaterial));
    return JSON.parse(JSON.stringify(notesData));
}


export async function getChaptersForSubcategory(subjectId: string, subcategoryId: string): Promise<Chapter[]> {
    const materialsQuery = query(
        collection(db, 'noteMaterials'), 
        where('subjectId', '==', subjectId), 
        where('subcategoryId', '==', subcategoryId)
    );
    const materialsSnapshot = await getDocs(materialsQuery);
    const materials = materialsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as NoteMaterial));

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

    return chapters;
}

export async function getOrders(): Promise<Order[]> {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const ordersSnapshot = await getDocs(ordersQuery);
    const ordersData = ordersSnapshot.docs.map(doc => ({...(doc.data() as Omit<Order, 'id'>), id: doc.id, createdAt: doc.data().createdAt.toDate() }));
    
    // This is a temporary workaround because of a serialization issue with firebase Timestamps and Next.js.
    // We convert it to a plain object that can be passed from server to client components.
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

export async function updateOrderStatus(orderId: string, status: 'new' | 'completed') {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
}

export async function deleteNoteMaterial(noteId: string) {
    const noteRef = doc(db, 'noteMaterials', noteId);
    await deleteDoc(noteRef);
}
