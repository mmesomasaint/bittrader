"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { BrainCircuit, Timer, BarChart, Eye, ChevronRight, Activity } from "lucide-react";

export default function IntelPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [isexecuting, setIsExecuting] = useState(false);

  const handleManualExecute = async () => {
    if (!selectedSignal) return;
    setIsExecuting(true);
  
    try {
      const response = await fetch('/api/trade/execute', {
        method: 'POST',
        body: JSON.stringify({
          signalId: selectedSignal.id,
          exchange: 'bybit' // Defaulting to Bybit for now
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (result.error === 'UPGRADE_REQUIRED') {
          setShowUpgrade(true); // Open your existing upgrade modal
        } else {
          toast.error(result.error, { description: result.message });
        }
        return;
      }
  
      toast.success("EXECUTION_CONFIRMED", {
        description: result.message,
        icon: <Zap size={16} className="text-crypto-green" />
      });
  
    } catch (error) {
      toast.error("NETWORK_ERROR", { description: "Failed to reach execution node." });
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    const fetchIntel = async () => {
      const { data, error } = await supabase
        .from('intel_logs')
        .select(`
          *,
          ticker_stats!left (
            win_rate
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error("Fetch Error:", error);
        return;
      }

      if (data) {
        setSignals(data);
        if (data[0]) setSelectedSignal(data[0]);
      }
    };
    
    fetchIntel();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-crypto-bg font-mono">
      {/* Top HUD */}
      <div className="p-4 border-b border-crypto-border flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-crypto-gold animate-pulse" size={18} />
          <h1 className="text-sm font-black text-white tracking-widest uppercase">Intelligence_Core // Signal_Stream</h1>
        </div>
        <div className="text-[10px] text-gray-500 flex gap-4 font-data">
          <span>Active_Nodes: 04</span>
          <span className="text-crypto-green">Uptime: 99.98%</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Signal Feed */}
        <div className="w-1/3 border-r border-crypto-border overflow-y-auto bg-black/10">
          {signals.length > 0 ? (
            signals.map((sig) => (
              <div 
                key={sig.id}
                onClick={() => setSelectedSignal(sig)}
                className={`p-4 border-b border-crypto-border cursor-pointer transition-all ${selectedSignal?.id === sig.id ? 'bg-crypto-card border-l-2 border-l-crypto-gold' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-white font-bold text-xs">{sig.ticker}/USDT</span>
                    {/* Success Rate Badge */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1 h-1 rounded-full bg-crypto-green"></div>
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">
                        System Accuracy: {Array.isArray(sig.ticker_stats) 
                          ? sig.ticker_stats[0]?.win_rate 
                          : sig.ticker_stats?.win_rate || '84'}%
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
              <div className="p-8 text-center text-[10px] text-gray-600 uppercase font-data animate-pulse">
                Waiting for BitTrader Node Signal...
              </div>
            )
          }
        </div>

        {/* Right: Deep Analysis Pane */}
        <div className="flex-1 bg-crypto-bg p-8 overflow-y-auto">
          {selectedSignal ? (
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic">{selectedSignal.ticker} Analysis</h2>
                  <p className="text-xs text-gray-500 font-data">ID: {selectedSignal.id.slice(0, 12)}... | DISCOVERY: VOL_SCAN_V1</p>
                </div>
                <div className="bg-crypto-card border border-crypto-border p-4 rounded-xl text-center min-w-[120px]">
                  <p className="text-[9px] text-gray-500 uppercase mb-1">AI_Confidence</p>
                  <p className={`text-2xl font-black ${selectedSignal.confidence > 80 ? 'text-crypto-green' : 'text-crypto-gold'}`}>
                    {selectedSignal.confidence}%
                  </p>
                </div>
              </div>

              {/* Data Visualization Placeholder */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-crypto-card p-4 border border-crypto-border rounded-lg">
                  <p className="text-[9px] text-gray-500 uppercase mb-2">Volume_24h</p>
                  <p className="text-lg text-white font-bold">$12.4M</p>
                </div>
                <div className="bg-crypto-card p-4 border border-crypto-border rounded-lg">
                  <p className="text-[9px] text-gray-500 uppercase mb-2">Whale_Net_Flow</p>
                  <p className="text-lg text-crypto-green font-bold">+2.4k SOL</p>
                </div>
                <div className="bg-crypto-card p-4 border border-crypto-border rounded-lg">
                  <p className="text-[9px] text-gray-500 uppercase mb-2">Social_Heat</p>
                  <p className="text-lg text-crypto-gold font-bold">EXCELLENT</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-white uppercase flex items-center gap-2 tracking-[0.2em]">
                  <Activity size={14} className="text-crypto-gold" /> Reasoning_Engine_Output
                </h3>
                <div className="bg-black/40 border border-crypto-border p-6 rounded-xl font-data text-sm leading-relaxed text-gray-300">
                  {selectedSignal.reasoning}
                </div>
              </div>

              <div className="pt-6 border-t border-crypto-border flex justify-between items-center">
                 <div className="text-[10px] text-gray-600">
                   SIGNAL SOURCE: <span className="text-white">OPTIMA_BITTRADER_NODE_01</span>
                 </div>
                 <button 
                    disabled={isExecuting}
                    onClick={handleManualExecute}
                    className="bg-crypto-gold text-black px-6 py-2 rounded font-black text-xs uppercase hover:bg-[#fcd535] transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isExecuting ? 'INITIALIZING...' : 'EXECUTE MANUAL POSITION'}
                    {!isExecuting && <ChevronRight size={14} />}
                  </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">
              -- SELECT A SIGNAL TO VIEW PREDATORY LOGIC --
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
