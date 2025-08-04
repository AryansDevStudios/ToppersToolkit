import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderList } from '@/components/OrderList';
import { NoteUploader } from '@/components/NoteUploader';
import { getOrders, getSubjects } from '@/lib/data';

export async function AdminTabs() {
  const orders = await getOrders();
  const subjects = await getSubjects();

  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="orders">Order Management</TabsTrigger>
        <TabsTrigger value="uploader">Note Uploader</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <OrderList orders={orders} />
      </TabsContent>
      <TabsContent value="uploader">
        <NoteUploader subjects={subjects} />
      </TabsContent>
    </Tabs>
  );
}
