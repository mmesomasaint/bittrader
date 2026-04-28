import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/system/DashboardSidebar';
import MobileNav from '@/components/system/MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-crypto-bg overflow-hidden">
      {/* Sidebar: Only visible on Large screens (lg+) */}
      <div className="hidden lg:flex h-full">
        <DashboardSidebar user={user} />
      </div>

      <main className="flex-1 overflow-y-auto bg-[#050505] relative">
        {children}
      </main>

      {/* Mobile Bottom Nav: Only visible on mobile/tablet (below lg) */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
