"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Zap, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { name: 'Terminal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Intel', href: '/intel', icon: Zap },
    { name: 'Vault', href: '/settings', icon: ShieldCheck },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-crypto-border flex flex-col bg-black h-full">
      <div className="p-8">
        <div className="text-2xl font-black italic text-white tracking-tighter">
          <span className="text-crypto-gold">BIT.</span>TRADER
        </div>
        <p className="text-[10px] text-gray-600 font-mono mt-2 uppercase tracking-[0.3em]">
          OP: {user.email?.split('@')[0]}
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest ${
                isActive 
                  ? 'bg-crypto-gold text-black shadow-[0_0_20px_rgba(240,185,11,0.15)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} strokeWidth={2.5} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 text-gray-600 hover:text-crypto-red transition px-4 py-2 w-full font-bold uppercase text-[10px] tracking-widest"
        >
          <LogOut size={14} /> Terminate_Session
        </button>
      </div>
    </aside>
  );
}
