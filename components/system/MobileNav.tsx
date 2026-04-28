"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, ShieldCheck, User } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Terminal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Intel', href: '/intel', icon: Zap },
    { name: 'Vault', href: '/settings', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 flex justify-around items-center z-[100] pb-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className="flex flex-col items-center gap-1 relative"
          >
            <item.icon 
              size={20} 
              strokeWidth={isActive ? 3 : 2}
              className={isActive ? "text-crypto-gold" : "text-gray-500"} 
            />
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? "text-white" : "text-gray-500"}`}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute -top-3 w-8 h-[2px] bg-crypto-gold shadow-[0_0_10px_#F0B90B]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
