import { LayoutDashboard, Newspaper, Settings, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-binance-border bg-binance-gray flex flex-col">
      <div className="p-6 flex items-center gap-2 mb-8">
        <Zap className="text-binance-yellow fill-binance-yellow" size={24} />
        <span className="font-black italic tracking-tighter text-lg">OPTIMA LOGIC</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Profit Cockpit" active />
        <SidebarLink href="/dashboard/intel" icon={<Newspaper size={20} />} label="Intel Feed" />
        <SidebarLink href="/dashboard/settings" icon={<Settings size={20} />} label="Bot Setup" />
      </nav>

      <div className="p-4 border-t border-binance-border">
        <button className="flex items-center gap-3 text-gray-400 hover:text-binance-red transition w-full px-4 py-3">
          <LogOut size={20} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-binance-yellow/10 text-binance-yellow' : 'text-gray-400 hover:bg-binance-black hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}