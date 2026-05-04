"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Zap, Cpu, Users, BarChart3, Terminal, Activity } from "lucide-react";
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { profile, loading: userLoading } = useUser();
  const { totalUsers, proUsers, totalVolume, isLoading } = useAdminStats();
  const [logs, setLogs] = useState<{id: string, msg: string, time: string, type: string}[]>([]);
  const supabase = createClient();
  const [targetUser, setTargetUser] = useState("");

  // Admin Security Check
  if (!userLoading && !profile?.is_admin) {
    redirect('/dashboard');
  }

  const sendCommand = async (userId: string, type: string, symbol?: string) => {
    const { error } = await supabase
      .from('admin_commands')
      .insert([{ 
        user_id: userId, 
        command_type: type, 
        symbol: symbol, 
        status: 'pending' 
      }]);
  
    if (!error) {
      toast.success(`COMMAND_BROADCAST: ${type}`);
    } else {
      toast.error("OVERRIDE_LINK_FAILURE");
    }
  };

  // Real-time Subscription to the 'trades' table
  useEffect(() => {
    const channel = supabase
      .channel('admin-live-logs')
      .on('postgres_changes', { event: 'INSERT', table: 'trades' }, (payload) => {
        const newLog = {
          id: payload.new.id,
          msg: `EXECUTOR: Executed ${payload.new.symbol} for User_${payload.new.user_id.slice(0,5)}`,
          time: new Date().toLocaleTimeString(),
          type: 'trade'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (isLoading || userLoading) return <div className="p-8 font-mono text-red-500 animate-pulse">INIT_AUTH_SEQUENCE...</div>;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 font-mono bg-[#050505] min-h-screen text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-900/30 pb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-red-500 w-7 h-7" />
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">System_Override_Console</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-bold">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> DB_CONNECTED</span>
          <span className="text-red-900">|</span>
          <span className="text-gray-500">ROOT_ACCESS: ENABLED</span>
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AdminStatCard title="Total_Operators" value={totalUsers} icon={Users} />
        <AdminStatCard title="Tier_02_Users" value={proUsers} icon={Zap} />
        <AdminStatCard 
          title="Total_Vol_Secured" 
          value={`$${(totalVolume / 1000).toFixed(1)}K`} 
          icon={BarChart3} 
        />
        <AdminStatCard title="Health_Index" value="99.9%" icon={Activity} />
      </div>

      {/* Live Activity Stream */}
      <div className="bg-[#0A0A0A] border border-red-900/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} /> Live_Database_Stream
          </h3>
          <div className="flex gap-2">
             <button onClick={() => setLogs([])} className="text-[9px] text-gray-600 hover:text-white uppercase">[Clear_Logs]</button>
          </div>
        </div>
        
        <div className="bg-black p-4 rounded border border-white/5 h-96 overflow-y-auto text-[11px] font-mono space-y-1 scrollbar-hide">
          {logs.length === 0 && (
            <p className="text-gray-700 italic">Waiting for incoming database events...</p>
          )}
          {logs.map((log) => (
            <p key={log.id} className="leading-relaxed border-l-2 border-red-900/30 pl-3 py-1 bg-white/5">
              <span className="text-gray-600 mr-2">[{log.time}]</span>
              <span className="text-green-500">{log.msg}</span>
            </p>
          ))}
        </div>
      </div>

      {/* User Control Section */}
      <div className="bg-[#0A0A0A] border border-red-900/20 rounded-2xl p-6 mt-8">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Operator_Intervention_Panel</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-gray-600 border-b border-white/5 uppercase">
                <th className="pb-3 px-2">Operator_ID</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Risk_Level</th>
                <th className="pb-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* You would map your users here */}
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-2 font-bold">User_92f1a...</td>
                <td className="py-4 px-2"><span className="text-green-500">ACTIVE</span></td>
                <td className="py-4 px-2 text-crypto-gold font-bold">PRO</td>
                <td className="py-4 px-2 flex gap-3">
                  <button 
                    onClick={() => sendCommand('user_uuid', 'KILL_POSITION', 'BTCUSDT')}
                    className="bg-red-900/20 text-red-500 px-3 py-1 rounded border border-red-900/50 hover:bg-red-500 hover:text-white transition-all font-black"
                  >
                    TERMINATE_POSITIONS
                  </button>
                  <button className="text-gray-500 hover:text-white uppercase">[Inspect]</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-[#0D0D0D] border border-white/5 p-6 rounded-xl hover:border-red-500/30 transition-all group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{title}</span>
        <Icon size={14} className="text-gray-600 group-hover:text-red-500 transition-colors" />
      </div>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}
