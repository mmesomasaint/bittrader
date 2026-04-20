"use client";

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Settings, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Terminal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Guidance', href: '/guidance', icon: BookOpen },
  ];

  // If no user is authenticated, kick them back to login
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-crypto-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-crypto-border flex flex-col">
        <div className="p-6 text-xl font-black italic text-white underline decoration-crypto-gold">OPTIMA</div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                pathname === item.href ? 'bg-crypto-gold text-black' : 'text-gray-400 hover:text-white hover:bg-crypto-card'
              }`}
            >
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-crypto-border">
          <button className="flex items-center gap-3 text-gray-500 hover:text-crypto-red transition px-4 py-2 w-full font-bold">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}