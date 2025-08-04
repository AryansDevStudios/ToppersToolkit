'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to parse cart items from localStorage', error);
      localStorage.removeItem('cartItems');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart items to localStorage', error);
      }
    }
  }, [items, isMounted]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      // Prevent adding duplicates
      if (prevItems.find((i) => i.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = isMounted ? items.length : 0;
  const totalPrice = isMounted ? items.reduce((sum, item) => sum + item.price, 0) : 0;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, itemCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
