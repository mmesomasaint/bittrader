"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { Zap, Activity, TrendingUp, Wallet, ArrowUpRight } from "lucide-react";

export default function DashboardMain() {
  const [stats, setStats] = useState({ active: 0, volume: 0, signals: 0 });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch Stats from DB
        const { count: activeCount } = await supabase
          .from('api_keys')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        const { count: signalCount } = await supabase
          .from('trades')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ghost')
          .gte('created_at', new Date(Date.now() - 86400000).toISOString());

        // Fetch User's specific connected accounts for the HUD
        const { data: userKeys } = await supabase
          .from('api_keys')
          .select('exchange_name, is_active')
          .eq('is_active', true);

        setStats({ 
          active: activeCount || 0, 
          volume: 1.25, // Logic for volume can be summed from closed trades later
          signals: signalCount || 0 
        });

        setAccounts(userKeys || []);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time listener for new signals to update the Signal Count
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'trades', filter: 'status=eq.ghost' }, 
        () => fetchDashboardData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="p-8 space-y-8 bg-crypto-bg min-h-screen">
      {/* Header HUD */}
      <div className="flex justify-between items-end border-b border-crypto-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Command Terminal</h1>
          <p className="text-[10px] text-gray-500 font-data">NODE: SG-01-EXECUTOR | {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase">Engine Status</p>
          <p className="text-crypto-green font-data font-bold">SYNCED // 1.90ms</p>
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-crypto-card border border-crypto-border p-6 rounded-xl group hover:border-crypto-green transition-colors">
          <div className="flex gap-2 items-center mb-4 text-gray-500 uppercase text-[10px] font-bold">
            <Activity size={14} className="group-hover:text-crypto-green" /> Active Connections
          </div>
          <p className="text-4xl font-bold text-white">{stats.active}</p>
        </div>
        
        <div className="bg-crypto-card border border-crypto-border p-6 rounded-xl group hover:border-white transition-colors">
          <div className="flex gap-2 items-center mb-4 text-gray-500 uppercase text-[10px] font-bold">
            <TrendingUp size={14} /> Total Volume (24h)
          </div>
          <p className="text-4xl font-bold text-white font-data">${stats.volume}M</p>
        </div>

        <div className="bg-crypto-card border border-crypto-border p-6 rounded-xl border-l-4 border-l-crypto-gold group hover:bg-crypto-gold/5 transition-all">
          <div className="flex gap-2 items-center mb-4 text-crypto-gold uppercase text-[10px] font-bold">
            <Zap size={14} /> Global Signals (24h)
          </div>
          <p className="text-4xl font-bold text-white">{stats.signals}</p>
        </div>
      </div>

      {/* User Portfolio HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-crypto-card border border-crypto-border rounded-2xl p-6">
          <h3 className="text-xs font-black text-gray-500 uppercase mb-6 flex items-center gap-2">
            <Wallet size={14} /> Connected Exchange Nodes
          </h3>
          <div className="space-y-4">
            {accounts.length > 0 ? accounts.map((acc, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-crypto-bg border border-crypto-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-crypto-green animate-pulse"></div>
                  <span className="text-sm font-bold text-white uppercase">{acc.exchange_name} Mainnet</span>
                </div>
                <ArrowUpRight size={14} className="text-gray-600" />
              </div>
            )) : (
              <p className="text-xs text-gray-600 italic">No active exchange connections found. Configure in Settings.</p>
            )}
          </div>
        </div>

        {/* Live Execution Stream Placeholder */}
        <div className="bg-crypto-card border border-crypto-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-crypto-border bg-black/20">
             <span className="text-[10px] font-black uppercase text-gray-400">Live Intelligence Stream</span>
          </div>
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-crypto-gold mb-4"></div>
            <p className="text-xs text-gray-600 italic font-data block tracking-widest">
              WAITING FOR BLACK MARLIN SIGNALS...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}