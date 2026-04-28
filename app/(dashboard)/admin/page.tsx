"use client";
import { useUser } from '@/hooks/use-user';
import { ShieldCheck, Zap, Cpu, Users, BarChart3 } from "lucide-react";
import { redirect } from 'next/navigation';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType; // This handles the Lucide icons we pass in
}

export default function AdminDashboard() {
  const { profile, loading } = useUser();

  if (!loading && !profile?.is_admin) {
    redirect('/dashboard'); // Kick non-admins out
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 font-mono bg-crypto-bg min-h-screen pb-24 md:pb-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-red-900/30 pb-4 md:pb-6">
        <ShieldCheck className="text-red-500 shrink-0 w-6 h-6 md:w-7 md:h-7" />
        <h1 className="text-lg md:text-2xl font-black text-white uppercase italic truncate">
          System_Override_Console
        </h1>
      </div>

      {/* Grid: 2 columns on small screens, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AdminStatCard title="Total_Users" value="142" icon={Users} />
        <AdminStatCard title="Active_Nodes" value="04" icon={Cpu} />
        <AdminStatCard title="Sys_Volume" value="$4.2M" icon={BarChart3} />
        <AdminStatCard title="Health" value="99.9%" icon={Zap} />
      </div>

      {/* Log Stream */}
      <div className="bg-[#0A0A0A] border border-red-900/20 rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={12} /> Global_Log_Stream
          </h3>
          <span className="text-[8px] font-bold text-red-900 animate-pulse">ENCRYPTED_LINK</span>
        </div>
        
        <div className="bg-black p-3 md:p-4 rounded border border-white/5 h-64 md:h-80 overflow-y-auto text-[9px] md:text-[10px] text-green-500 space-y-2 scrollbar-thin scrollbar-thumb-red-900/20">
          <p className="leading-relaxed"><span className="opacity-40">[17:22:01]</span> SCANNER_01: Detecting BTC/USDT Whale Inflow...</p>
          <p className="leading-relaxed"><span className="opacity-40">[17:22:05]</span> EXECUTOR_NODE: Checking user permissions for 12 active PROs...</p>
          <p className="text-yellow-500 leading-relaxed"><span className="opacity-40">[17:22:10]</span> NOTIFIER: Telegram API Rate limit at 40% capacity.</p>
          <p className="leading-relaxed text-blue-400"><span className="opacity-40">[17:22:15]</span> SYSTEM: Integrity check passed. All nodes green.</p>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="bg-black/40 border border-white/5 p-4 md:p-6 rounded-xl group hover:border-red-900/20 transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase truncate pr-2">{title}</span>
        <Icon size={12} className="text-gray-600 group-hover:text-red-500 transition-colors" />
      </div>
      <p className="text-xl md:text-2xl font-black text-white italic">{value}</p>
    </div>
  );
}
