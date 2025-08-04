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

export type NoteMaterial = {
  id: string;
  subjectId: string;
  subjectName: string;
  subcategoryId: string;
  subcategoryName: string;
  chapter: string;
  type: 'Notes' | 'Question Bank' | 'Important Dates' | 'Summary';
  description: string;
  imageUrl?: string;
  status: 'published' | 'hidden';
  createdAt: Timestamp;
  price: number;
};

export type CartItem = {
  id: string;
  subjectName: string;
  chapter: string;
  type: string;
  price: number;
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
};

export type Chapter = {
  name: string;
  materials: NoteMaterial[];
}
