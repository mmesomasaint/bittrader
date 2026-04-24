"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, BookOpen, LogOut, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { name: 'Terminal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Intel', href: '/intel', icon: Zap }, // Added your Intel page
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Guidance', href: '/guidance', icon: BookOpen },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-crypto-border flex flex-col bg-black">
      <div className="p-6">
        <div className="text-xl font-black italic text-white tracking-tighter">
          OPTIMA<span className="text-crypto-gold">.LOGIC</span>
        </div>
        <p className="text-[10px] text-gray-600 font-mono mt-1 uppercase tracking-widest">Operator: {user.email?.split('@')[0]}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-xs font-bold uppercase tracking-widest ${
                isActive 
                  ? 'bg-crypto-gold text-black shadow-[0_0_15px_rgba(240,185,11,0.2)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-crypto-border">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 text-gray-500 hover:text-crypto-red transition px-4 py-3 w-full font-black uppercase text-[10px] tracking-widest"
        >
          <LogOut size={16} /> Sign Out Session
        </button>
      </div>
    </aside>
  );
}