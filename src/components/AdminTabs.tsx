import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderList } from '@/components/OrderList';
import { NoteUploader } from '@/components/NoteUploader';
import { NoteManager } from '@/components/NoteManager';
import { getOrders, getAllNotes } from '@/lib/data';

export async function AdminTabs() {
  const orders = await getOrders();
  const notes = await getAllNotes();

  return (
    <Tabs defaultValue="orders" className="w-full">
      <div className="flex justify-center">
        <TabsList className="h-auto flex-wrap justify-center">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="uploader">Note Uploader</TabsTrigger>
          <TabsTrigger value="manager">Note Manager</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="orders">
        <OrderList orders={orders} />
      </TabsContent>
      <TabsContent value="uploader">
        <NoteUploader />
      </TabsContent>
       <TabsContent value="manager">
        <NoteManager notes={notes} />
      </TabsContent>
    </Tabs>
  );
}
