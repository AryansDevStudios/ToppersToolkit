import { AdminTabs } from "@/components/AdminTabs";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/AdminPageSkeleton";

export default function AdminPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-headline mb-8">Admin Portal</h1>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminTabs />
      </Suspense>
    </div>
  );
}
