import type { Subject, NoteMaterial, Chapter, Order } from '@/types';
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, orderBy } from 'firebase/firestore';


// API-like functions to get data from Firestore
export async function getSubjects(): Promise<Subject[]> {
  const subjectsCol = collection(db, 'subjects');
  const subjectSnapshot = await getDocs(subjectsCol);
  const subjectList = subjectSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Subject));
  return subjectList;
}

export async function getSubjectById(id: string): Promise<Subject | undefined> {
  const subjectRef = doc(db, 'subjects', id);
  const subjectSnap = await getDoc(subjectRef);
  if (subjectSnap.exists()) {
    return { ...subjectSnap.data(), id: subjectSnap.id } as Subject;
  }
  return undefined;
}

export async function getFeaturedNotes(): Promise<NoteMaterial[]> {
    const notesQuery = query(collection(db, 'noteMaterials'), where('isFeatured', '==', true));
    const notesSnapshot = await getDocs(notesQuery);
    return notesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as NoteMaterial));
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
    return ordersSnapshot.docs.map(doc => ({...doc.data(), id: doc.id } as Order));
}

export async function saveOrder(order: Omit<Order, 'id'>) {
    const ordersCollection = collection(db, 'orders');
    await addDoc(ordersCollection, order);
}

export async function saveNoteMaterial(note: Omit<NoteMaterial, 'id'>) {
    const notesCollection = collection(db, 'noteMaterials');
    await addDoc(notesCollection, note);
}
