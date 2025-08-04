import type { Subject, NoteMaterial, Chapter, Order } from '@/types';

// Mock data, in a real app this would come from Firestore
const subjects: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    subcategories: [
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'biology', name: 'Biology' },
    ],
  },
  {
    id: 'sst',
    name: 'SST',
    subcategories: [
      { id: 'history', name: 'History' },
      { id: 'civics', name: 'Civics' },
      { id: 'geography', name: 'Geography' },
      { id: 'economics', name: 'Economics' },
    ],
  },
  {
    id: 'maths',
    name: 'Maths',
    subcategories: [
      { id: 'algebra', name: 'Algebra' },
      { id: 'geometry', name: 'Geometry' },
    ],
  },
  {
    id: 'english',
    name: 'English',
    subcategories: [
      { id: 'literature', name: 'Literature' },
      { id: 'grammar', name: 'Grammar' },
    ],
  },
];

const noteMaterials: NoteMaterial[] = [
  // Science - Physics
  { id: 'phys1_notes', subjectId: 'science', subjectName: 'Science', subcategoryId: 'physics', subcategoryName: 'Physics', chapter: 'Motion', type: 'Notes', description: 'Comprehensive notes on the chapter Motion.', imageUrl: 'https://placehold.co/600x400', isFeatured: true },
  { id: 'phys1_qb', subjectId: 'science', subjectName: 'Science', subcategoryId: 'physics', subcategoryName: 'Physics', chapter: 'Motion', type: 'Question Bank', description: 'A bank of important questions for Motion.' },
  { id: 'phys2_notes', subjectId: 'science', subjectName: 'Science', subcategoryId: 'physics', subcategoryName: 'Physics', chapter: 'Force and Laws of Motion', type: 'Notes', description: 'Detailed notes on Force and Laws of Motion.' },
  { id: 'phys2_summary', subjectId: 'science', subjectName: 'Science', subcategoryId: 'physics', subcategoryName: 'Physics', chapter: 'Force and Laws of Motion', type: 'Summary', description: 'A quick summary of the chapter.' },

  // SST - History
  { id: 'hist1_notes', subjectId: 'sst', subjectName: 'SST', subcategoryId: 'history', subcategoryName: 'History', chapter: 'The French Revolution', type: 'Notes', description: 'In-depth notes on the French Revolution.', imageUrl: 'https://placehold.co/600x400', isFeatured: true },
  { id: 'hist1_dates', subjectId: 'sst', subjectName: 'SST', subcategoryId: 'history', subcategoryName: 'History', chapter: 'The French Revolution', type: 'Important Dates', description: 'Key dates and events of the revolution.' },
  { id: 'hist2_notes', subjectId: 'sst', subjectName: 'SST', subcategoryId: 'history', subcategoryName: 'History', chapter: 'Socialism in Europe', type: 'Notes', description: 'Comprehensive notes on Socialism in Europe.' },
  { id: 'hist2_qb', subjectId: 'sst', subjectName: 'SST', subcategoryId: 'history', subcategoryName: 'History', chapter: 'Socialism in Europe', type: 'Question Bank', description: 'A list of important questions.' },
  
  // Maths - Algebra
  { id: 'alg1_notes', subjectId: 'maths', subjectName: 'Maths', subcategoryId: 'algebra', subcategoryName: 'Algebra', chapter: 'Polynomials', type: 'Notes', description: 'Detailed notes on Polynomials.', imageUrl: 'https://placehold.co/600x400', isFeatured: true },
  { id: 'alg1_qb', subjectId: 'maths', subjectName: 'Maths', subcategoryId: 'algebra', subcategoryName: 'Algebra', chapter: 'Polynomials', type: 'Question Bank', description: 'Practice questions for Polynomials.' },
  
  // English - Literature
  { id: 'englit1_notes', subjectId: 'english', subjectName: 'English', subcategoryId: 'literature', subcategoryName: 'Literature', chapter: 'The Fun They Had', type: 'Notes', description: 'Summary and analysis of "The Fun They Had".', imageUrl: 'https://placehold.co/600x400', isFeatured: true },
  { id: 'englit1_summary', subjectId: 'english', subjectName: 'English', subcategoryId: 'literature', subcategoryName: 'Literature', chapter: 'The Fun They Had', type: 'Summary', description: 'A short summary of the story.' },
];

const mockOrders: Order[] = [
    {
        id: 'order1',
        name: 'Jane Doe',
        userClass: '10A',
        instructions: 'Please provide in printed format.',
        items: [
            { id: 'hist1_notes', subjectName: 'SST', chapter: 'The French Revolution', type: 'Notes' },
            { id: 'phys1_qb', subjectName: 'Science', chapter: 'Motion', type: 'Question Bank' },
        ],
        createdAt: { seconds: 1672531200, nanoseconds: 0 } // Jan 1, 2023
    },
    {
        id: 'order2',
        name: 'John Smith',
        userClass: '9B',
        items: [
            { id: 'alg1_notes', subjectName: 'Maths', chapter: 'Polynomials', type: 'Notes' },
        ],
        createdAt: { seconds: 1675209600, nanoseconds: 0 } // Feb 1, 2023
    }
];

// API-like functions to get data
export async function getSubjects(): Promise<Subject[]> {
  // In a real app, you'd fetch this from Firestore.
  return Promise.resolve(subjects);
}

export async function getSubjectById(id: string): Promise<Subject | undefined> {
  return Promise.resolve(subjects.find(s => s.id === id));
}

export async function getFeaturedNotes(): Promise<NoteMaterial[]> {
  return Promise.resolve(noteMaterials.filter(n => n.isFeatured));
}

export async function getChaptersForSubcategory(subjectId: string, subcategoryId: string): Promise<Chapter[]> {
    const materials = noteMaterials.filter(
        m => m.subjectId === subjectId && m.subcategoryId === subcategoryId
    );

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

    return Promise.resolve(chapters);
}

export async function getOrders(): Promise<Order[]> {
    return Promise.resolve(mockOrders);
}
