
import { Timestamp } from 'firebase/firestore';

export type Subject = {
  id: string;
  name: string;
  subcategories: SubCategory[];
};

export type SubCategory = {
  id: string;
  name: string;
};

export type PriceInfo = {
  pdf?: number;
  printed?: number;
};

// Represents a single, purchasable note item (e.g., "Summary", "Question Bank")
export type NoteItem = {
  id: string; // Unique ID for this item, e.g., 'summary-item'
  name: string; // e.g., "Handwritten Notes", "Summary"
  description: string;
  imageUrl?: string; // Optional specific image for this item
  prices: PriceInfo;
  status: 'published' | 'hidden'; // Individual status for the item
  createdAt: Timestamp | string; // Timestamp for when the item was added
};

// Represents a collection of notes for a single chapter
export type NoteMaterial = {
  id: string;
  subjectId: string;
  subjectName: string;
  subcategoryId: string;
  subcategoryName: string;
  chapter: string;
  description: string; // Main description for the chapter notes
  imageUrl?: string; // Main image for the whole chapter notes collection
  createdAt: Timestamp | string; // Allow string for client-side representation
  items: NoteItem[]; // Array of different note types for this chapter
};

// Type for a flattened note item used for display purposes
export type RecentNoteItem = Omit<NoteMaterial, 'items'> & {
  type: string;
  price: number;
};


export type CartItem = {
  id: string; // Combination of noteId and noteItemId, e.g., 'chapterNoteId-summary-item'
  noteId: string;
  noteItemId: string;
  subjectName: string;
  chapter: string;
  type: string; // e.g., "Handwritten Notes"
  price: number; // This will be the price for the selected format
  prices: PriceInfo; // Contains both pdf and printed prices
  selectedFormat: 'PDF' | 'Printed';
};

export type Order = {
  id:string;
  name: string;
  userClass: string;
  whatsappNumber?: string;
  instructions?: string;
  items: CartItem[];
  createdAt: Timestamp | string;
  status: 'new' | 'completed';
  totalPrice: number;
  paymentMethod: 'COD' | 'UPI';
};

export type Chapter = {
  name: string;
  materials: NoteMaterial[];
}

export type AdminSettings = {
    passphrase?: string;
    printPricePerPage?: number;
}
