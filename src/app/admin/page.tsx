import { AdminTabs } from "@/components/AdminTabs";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/AdminPageSkeleton";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuth } from "@/lib/auth";

export default async function AdminPage() {
  const auth = await verifyAuth(cookies().get('auth')?.value);

  if (!auth.authenticated) {
    redirect('/auth');
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-headline mb-8">Admin Portal</h1>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminTabs />
      </Suspense>
    </div>
  );
}
