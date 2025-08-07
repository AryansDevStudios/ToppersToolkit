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

export type NotePrices = {
  handwritten?: PriceInfo;
  typed?: PriceInfo;
  questionBank?: PriceInfo;
};

export type NoteMaterial = {
  id: string;
  subjectId: string;
  subjectName: string;
  subcategoryId: string;
  subcategoryName: string;
  chapter: string;
  description: string;
  imageUrl?: string;
  status: 'published' | 'hidden';
  createdAt: Timestamp;
  prices: NotePrices;
};

export type CartItem = {
  id: string; // Combination of noteId and type, e.g., 'noteId-handwritten'
  noteId: string;
  subjectName: string;
  chapter: string;
  type: 'Handwritten Notes' | 'Typed Notes' | 'Question Bank';
  price: number; // This will be the price for the selected format
  prices: PriceInfo; // Contains both pdf and printed prices
  selectedFormat: 'PDF' | 'Printed';
};

export type Order = {
  id:string;
  name: string;
  userClass: string;
  instructions?: string;
  items: CartItem[];
  createdAt: Timestamp;
  status: 'new' | 'completed';
  totalPrice: number;
  paymentMethod: 'COD' | 'UPI';
};

export type Chapter = {
  name: string;
  materials: NoteMaterial[];
}
