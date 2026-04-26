"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useUser } from '@/hooks/use-user';
import { Zap, Activity, TrendingUp, Wallet, ArrowUpRight, Globe, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardMain() {
  const { user, profile, loading: userLoading } = useUser();
  const [stats, setStats] = useState({ volume: 1.25, signals: 0 });
  const [liveSignals, setLiveSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch real-time signals count for the last 24h
        const { count: signalCount } = await supabase
          .from('intel_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 86400000).toISOString());

        // Fetch latest 3 signals for the stream
        const { data: recentSignals } = await supabase
          .from('intel_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        setStats(prev => ({ ...prev, signals: signalCount || 0 }));
        setLiveSignals(recentSignals || []);
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'intel_logs' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userLoading]);

  // Derived state for the UI
  const activeExchanges = [
    { name: 'Bybit', active: !!profile?.bybit_key },
    { name: 'Binance', active: !!profile?.binance_key },
  ].filter(ex => ex.active);

  return (
    <div className="p-8 space-y-10 bg-[#050505] min-h-screen font-mono">
      
      {/* 1. ARCHITECTURAL HUD HEADER */}
      <div className="flex justify-between items-start border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Command<span className="text-crypto-gold">.Terminal</span>
          </h1>
          <div className="flex items-center gap-4">
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Dashboard</span>
             <span className="h-1 w-1 rounded-full bg-gray-700" />
             <span className="text-[10px] text-crypto-green font-bold uppercase tracking-widest animate-pulse">Node_Active: Lagos_NG</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Latency_Check</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="h-[2px] w-8 bg-crypto-green/20 overflow-hidden relative">
                <motion.div 
                    animate={{ x: [-32, 32] }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="absolute inset-0 bg-crypto-green w-4" 
                />
            </div>
            <p className="text-white font-black italic text-sm">1.90ms</p>
          </div>
        </div>
      </div>

      {/* 2. HIGH-IMPACT STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Nodes", value: activeExchanges.length, icon: Activity, color: "text-white" },
          { label: "24h Volume", value: `$${stats.volume}M`, icon: TrendingUp, color: "text-white" },
          { label: "BitTrader Signals", value: stats.signals, icon: Zap, color: "text-crypto-gold" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl relative overflow-hidden group"
          >
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity`} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <p className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 3. DUAL-STREAM VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Wallet / Accounts Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 lg:col-span-1">
          <h3 className="text-xs font-black text-white uppercase mb-8 flex items-center gap-3">
            <Wallet size={16} className="text-crypto-gold" /> Connectivity_Vault
          </h3>
          <div className="space-y-3">
            {activeExchanges.length > 0 ? activeExchanges.map((acc) => (
              <div key={acc.name} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-crypto-green shadow-[0_0_8px_rgba(14,203,129,0.5)]"></div>
                  <span className="text-xs font-black text-white uppercase italic">{acc.name} Mainnet</span>
                </div>
                <ArrowUpRight size={14} className="text-gray-700 group-hover:text-white transition-colors" />
              </div>
            )) : (
              <div className="p-6 border border-dashed border-white/10 rounded-xl text-center">
                 <ShieldAlert className="mx-auto mb-2 text-gray-700" size={20} />
                 <p className="text-[10px] text-gray-500 uppercase font-bold">No Encrypted Keys Found</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Intelligence Stream (THE REASONING FEED) */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
               <Globe size={14} className="animate-spin-slow" /> Raw_Intelligence_Stream
             </span>
             <span className="text-[9px] font-bold text-crypto-gold bg-crypto-gold/10 px-2 py-0.5 rounded">LIVE_DATA</span>
          </div>
          
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {liveSignals.length > 0 ? liveSignals.map((sig, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={sig.id}
                  className="p-6 border-b last:border-0 border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white italic">{sig.ticker}/USDT</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${sig.sentiment === 'bullish' ? 'text-crypto-green bg-crypto-green/10' : 'text-crypto-red bg-crypto-red/10'}`}>
                          {sig.sentiment}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-data line-clamp-1">{sig.reasoning}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-white">{sig.confidence}%</p>
                       <p className="text-[9px] text-gray-600 font-bold uppercase">Confidence</p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="p-20 text-center">
                  <div className="inline-block animate-pulse text-gray-700">
                    <Zap size={40} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-4 tracking-[0.3em] uppercase">Monitoring Liquidity Shifts...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}