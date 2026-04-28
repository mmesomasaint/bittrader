"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { BrainCircuit, Timer, BarChart, Eye, ChevronRight, Activity, X } from "lucide-react";
import { UpgradeModal } from "@/components/system/UpgradeModal";
import { toast } from "sonner";

export default function IntelPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const handleManualExecute = async () => {
    if (!selectedSignal) return;
    setIsExecuting(true);
  
    try {
      const res = await fetch('/api/trade/execute', {
        method: 'POST',
        body: JSON.stringify({ 
          signalId: selectedSignal.id, 
          exchange: 'bybit' 
        })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        switch(data.error) {
          case 'UPGRADE_REQUIRED':
            setShowUpgrade(true);
            break;
          case 'VAULT_EMPTY':
            toast.error("VAULT_OFFLINE", { description: "Configure keys in Settings." });
            break;
          default:
            toast.error(data.error, { description: data.message });
        }
        return;
      }
  
      toast.success("TRADE_LIVE", {
        description: data.message,
        icon: <Activity className="text-crypto-green" size={16} />
      });
  
    } catch (e) {
      toast.error("NODE_TIMEOUT", { description: "Execution node unresponsive." });
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    const fetchIntel = async () => {
      const { data, error } = await supabase
        .from('intel_logs')
        .select('*, ticker_stats!left ( win_rate )')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setSignals(data);
        if (data[0] && window.innerWidth > 1024) setSelectedSignal(data[0]);
      }
    };
    fetchIntel();
  }, []);

  const selectSignal = (sig: any) => {
    setSelectedSignal(sig);
    if (window.innerWidth < 1024) {
      setIsMobileDetailOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-crypto-bg font-mono pb-16 lg:pb-0">
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      {/* Top HUD */}
      <div className="p-3 md:p-4 border-b border-crypto-border flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-2 md:gap-3">
          <BrainCircuit 
            className="text-crypto-gold animate-pulse shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]" 
          />
          <h1 className="text-[10px] md:text-sm font-black text-white tracking-widest uppercase truncate">Intelligence_Core</h1>
        </div>
        <div className="hidden sm:flex text-[9px] md:text-[10px] text-gray-500 gap-4 font-data">
          <span className="text-crypto-green">Uptime: 99.98%</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Signal Feed */}
        <div className="w-full lg:w-1/3 border-r border-crypto-border overflow-y-auto bg-black/10">
          {signals.length > 0 ? (
            signals.map((sig) => (
              <div 
                key={sig.id}
                onClick={() => selectSignal(sig)}
                className={`p-4 border-b border-crypto-border cursor-pointer transition-all hover:bg-white/[0.02] ${selectedSignal?.id === sig.id ? 'bg-crypto-card border-l-2 border-l-crypto-gold' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-white font-bold text-xs">{sig.ticker}/USDT</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1 h-1 rounded-full bg-crypto-green"></div>
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">
                        ACCURACY: {sig.ticker_stats?.[0]?.win_rate || '84'}%
                      </span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${sig.sentiment === 'bullish' ? 'text-crypto-green bg-crypto-green/10' : 'text-crypto-red bg-crypto-red/10'}`}>
                    {sig.sentiment.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[10px] text-gray-600 uppercase animate-pulse">Scanning_Market...</div>
          )}
        </div>

        {/* Right: Deep Analysis Pane */}
        <div className={`
          fixed inset-0 z-50 bg-crypto-bg lg:relative lg:inset-auto lg:flex-1 lg:block p-4 md:p-8 overflow-y-auto transition-transform duration-300
          ${isMobileDetailOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {selectedSignal ? (
            <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
              {/* Mobile Back Button */}
              <button 
                onClick={() => setIsMobileDetailOpen(false)}
                className="lg:hidden flex items-center gap-2 text-gray-500 mb-4"
              >
                <X size={20} /> <span className="text-[10px] font-bold uppercase">Back_to_Stream</span>
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">{selectedSignal.ticker}</h2>
                  <p className="text-[9px] text-gray-500 font-data">SOURCE: VOL_SCAN_V1</p>
                </div>
                <div className="bg-crypto-card border border-crypto-border p-3 md:p-4 rounded-xl text-center w-full md:w-auto min-w-[120px]">
                  <p className="text-[8px] text-gray-500 uppercase mb-1">AI_Confidence</p>
                  <p className={`text-xl md:text-2xl font-black ${selectedSignal.confidence > 80 ? 'text-crypto-green' : 'text-crypto-gold'}`}>
                    {selectedSignal.confidence}%
                  </p>
                </div>
              </div>

              {/* Data Visualization Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatBox label="Volume_24h" value="$12.4M" />
                <StatBox label="Whale_Flow" value="+2.4k SOL" color="text-crypto-green" />
                <StatBox label="Social_Heat" value="EXCELLENT" color="text-crypto-gold" className="col-span-2 md:col-span-1" />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-white uppercase flex items-center gap-2 tracking-widest">
                  <Activity size={14} className="text-crypto-gold" /> Engine_Output
                </h3>
                <div className="bg-black/40 border border-crypto-border p-4 md:p-6 rounded-xl font-data text-xs md:text-sm leading-relaxed text-gray-300">
                  {selectedSignal.reasoning}
                </div>
              </div>

              <div className="pt-6 border-t border-crypto-border flex flex-col md:flex-row gap-4 justify-between items-center pb-10 lg:pb-0">
                 <div className="text-[9px] text-gray-600">SOURCE: <span className="text-white">OPTIMA_NODE_01</span></div>
                 <button 
                    disabled={isExecuting}
                    onClick={handleManualExecute}
                    className="w-full md:w-auto bg-crypto-gold text-black px-8 py-3 rounded font-black text-xs uppercase hover:bg-[#fcd535] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExecuting ? 'INITIALIZING...' : 'EXECUTE POSITION'}
                    {!isExecuting && <ChevronRight size={14} />}
                  </button>
              </div>
            </div>
          ) : (
            <div className="hidden h-full lg:flex items-center justify-center text-gray-600 italic text-sm">
              -- SELECT A SIGNAL --
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "text-white", className = "" }: { label: string, value: string, color?: string, className?: string }) {
  return (
    <div className={`bg-crypto-card p-3 md:p-4 border border-crypto-border rounded-lg ${className}`}>
      <p className="text-[8px] text-gray-500 uppercase mb-1">{label}</p>
      <p className={`text-sm md:text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
