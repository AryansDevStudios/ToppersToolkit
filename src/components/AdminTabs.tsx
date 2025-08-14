
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderList } from '@/components/OrderList';
import { NoteUploader } from '@/components/NoteUploader';
import { NoteManager } from '@/components/NoteManager';
import { SettingsManager } from '@/components/SettingsManager';
import { getOrders, getAllNotes, getAdminSettings } from '@/lib/data';
import { PrintRequestList } from './PrintRequestList';

export async function AdminTabs() {
  const allOrders = await getOrders();
  const notes = await getAllNotes();
  const settings = await getAdminSettings();

  const noteOrders = allOrders.filter(order => order.items.every(item => item.noteId !== 'custom-print'));
  const printOrders = allOrders.filter(order => order.items.some(item => item.noteId === 'custom-print'));
  
  return (
    <Tabs defaultValue="orders" className="w-full">
      <div className="flex justify-center">
        <TabsList className="h-auto flex-wrap justify-center">
          <TabsTrigger value="orders">Note Orders</TabsTrigger>
          <TabsTrigger value="print-requests">Print Requests</TabsTrigger>
          <TabsTrigger value="uploader">Note Uploader</TabsTrigger>
          <TabsTrigger value="manager">Note Manager</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="orders">
        <OrderList orders={noteOrders} />
      </TabsContent>
      <TabsContent value="print-requests">
        <PrintRequestList orders={printOrders} pricePerPage={settings.printPricePerPage ?? 3.0} />
      </TabsContent>
      <TabsContent value="uploader">
        <NoteUploader notes={notes} />
      </TabsContent>
       <TabsContent value="manager">
        <NoteManager notes={notes} />
      </TabsContent>
      <TabsContent value="settings">
        <SettingsManager settings={settings} />
      </TabsContent>
    </Tabs>
  );
}
