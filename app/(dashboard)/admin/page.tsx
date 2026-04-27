"use client";
import { useUser } from '@/hooks/use-user';
import { ShieldCheck, Zap, Cpu, Users, BarChart3 } from "lucide-react";
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { profile, loading } = useUser();

  if (!loading && !profile?.is_admin) {
    redirect('/dashboard'); // Kick non-admins out
  }

  return (
    <div className="p-8 space-y-8 font-mono bg-crypto-bg min-h-screen">
      <div className="flex items-center gap-3 border-b border-red-900/30 pb-6">
        <ShieldCheck className="text-red-500" size={28} />
        <h1 className="text-2xl font-black text-white uppercase italic">System_Override_Console</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatCard title="Total_Users" value="142" icon={Users} />
        <AdminStatCard title="Active_Scanners" value="04" icon={Cpu} />
        <AdminStatCard title="System_Volume" value="$4.2M" icon={BarChart3} />
        <AdminStatCard title="Node_Health" value="99.9%" icon={Zap} />
      </div>

      <div className="bg-[#0A0A0A] border border-red-900/20 rounded-2xl p-6">
        <h3 className="text-xs font-black text-red-500 uppercase mb-4 tracking-widest">Global_Log_Stream</h3>
        <div className="bg-black p-4 rounded border border-white/5 h-64 overflow-y-auto text-[10px] text-green-500 space-y-1">
          <p>[17:22:01] SCANNER_01: Detecting BTC/USDT Whale Inflow...</p>
          <p>[17:22:05] EXECUTOR_NODE: Checking user permissions for 12 active PROs...</p>
          <p className="text-yellow-500">[17:22:10] NOTIFIER: Telegram API Rate limit at 40% capacity.</p>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-black/40 border border-white/5 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-gray-500 font-bold uppercase">{title}</span>
        <Icon size={14} className="text-gray-600" />
      </div>
      <p className="text-2xl font-black text-white italic">{value}</p>
    </div>
  );
}
