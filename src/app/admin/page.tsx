import { AdminTabs } from "@/components/AdminTabs";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/AdminPageSkeleton";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";
import { LogOut } from "lucide-react";

export default async function AdminPage() {
  const auth = await verifyAuth(cookies().get('auth')?.value);

  if (!auth.authenticated) {
    redirect('/auth');
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Admin Portal</h1>
        <form action={logout}>
          <Button variant="outline" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
      <Suspense fallback={<AdminPageSkeleton />}>
        <AdminTabs />
      </Suspense>
    </div>
  );
}
