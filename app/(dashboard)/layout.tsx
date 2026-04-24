import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/system/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Server-side security gate
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-crypto-bg">
      {/* 2. Pass the user to the client component if needed */}
      <DashboardSidebar user={user} />
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        {children}
      </main>
    </div>
  );
}