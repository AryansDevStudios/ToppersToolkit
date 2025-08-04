import { AdminTabs } from "@/components/AdminTabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AdminPageSkeleton() {
    return (
        <div className="w-full">
            <div className="grid w-full grid-cols-2 p-1 bg-muted rounded-md mb-4">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

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
