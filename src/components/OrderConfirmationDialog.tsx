
'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import type { Order } from '@/types';

type OrderConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Omit<Order, 'id' | 'createdAt' | 'status'> | null;
  isPrintRequest?: boolean;
};

const SELLER_WHATSAPP_NUMBER = '917754000411';

export function OrderConfirmationDialog({ isOpen, onClose, order, isPrintRequest = false }: OrderConfirmationDialogProps) {
  const [countdown, setCountdown] = useState(5);

  const generateWhatsAppMessage = () => {
    if (!order) return '';

    const customerName = order.name;
    const customerClass = order.userClass;
    const customerWhatsapp = order.whatsappNumber || 'N/A';
    const specialInstructions = order.instructions || 'None';
    const totalPrice = isPrintRequest ? 'To be confirmed' : `₹${order.totalPrice.toFixed(2)}`;
    const paymentMode = order.paymentMethod;

    let itemsList = '';
    if (isPrintRequest) {
      // Special formatting for print requests
      const { url, userInstructions } = parseInstructions(order.instructions);
      itemsList = `Custom Print Request: ${url}\n   Instructions: ${userInstructions || 'None'}`;
    } else {
      itemsList = order.items.map((item, index) => 
        `${index + 1}. ${item.type} - ${item.chapter}\n` +
        `   Subject: ${item.subjectName}\n` +
        `   Format: ${item.selectedFormat}\n` +
        `   Price: ${item.price === 0 ? 'Free' : `₹${item.price.toFixed(2)}`}`
      ).join('\n\n');
    }

    const messageTemplate = `🌟 Hello Kuldeep! You got a new order from Topper's Toolkit Shop. 🌟

🧑 Customer Details:
Name: ${customerName}
Class: ${customerClass}
WhatsApp: wa.me/${customerWhatsapp.replace(/\D/g, '')}
Special Instructions: ${isPrintRequest ? parseInstructions(order.instructions).userInstructions : specialInstructions}

📚 Here are the ordered materials:
${itemsList}

💰 Total price: ${totalPrice}
💳 Payment mode: ${paymentMode}

ℹ️ Note: This message can be edited or changed. Please visit https://topperstoolkit.netlify.app/admin for viewing verified details.`;

    return encodeURIComponent(messageTemplate);
  };
  
  const parseInstructions = (text: string | undefined) => {
    if (!text) return { url: null, userInstructions: null };
    const lines = text.split('\n');
    const urlLine = lines.find(line => line.startsWith('https://wormhole.app/'));
    const url = urlLine || null;
    const userInstructions = lines.filter(line => !line.startsWith('https://wormhole.app/')).join('\n').trim();
    return { url, userInstructions: userInstructions || null };
  };

  const whatsAppUrl = `https://wa.me/${SELLER_WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isOpen && countdown === 0) {
      window.location.href = whatsAppUrl;
      onClose();
    }
  }, [isOpen, countdown, onClose, whatsAppUrl]);

  // Reset countdown when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
    }
  }, [isOpen]);

  const handleOpenWhatsApp = () => {
    window.location.href = whatsAppUrl;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="mt-4">Order Confirmed!</DialogTitle>
          <DialogDescription>
            Next, you'll be redirected to WhatsApp to send the order details to the seller. Please just press send.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <p className="text-sm text-muted-foreground">Opening WhatsApp in...</p>
          <p className="text-4xl font-bold">{countdown}</p>
        </div>
        <div className="flex flex-col gap-2">
           <Button onClick={handleOpenWhatsApp}>
              Send on WhatsApp Now
              <ExternalLink className="ml-2 h-4 w-4" />
           </Button>
           <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
