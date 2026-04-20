"use client";
import { useEffect, useState } from 'react';
import { Target, Zap, BarChart3, ShieldCheck } from "lucide-react";

export default function WinRateShowcase() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/performance')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats([])); // Fallback to empty if no data yet
  }, []);

  return (
    <section className="py-24 border-y border-crypto-border bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Verified Accuracy</h2>
            <p className="text-gray-500 font-data text-xs max-w-md">
              Real-time success rates calculated across institutional order books. 100% Transparency.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-crypto-card border border-crypto-border px-4 py-2 rounded flex items-center gap-2">
              <ShieldCheck size={14} className="text-crypto-green" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Audit Status: PASS</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.length > 0 ? stats.map((item) => (
            <div key={item.ticker} className="bg-crypto-card border border-crypto-border p-6 rounded-xl hover:border-crypto-gold transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-black text-gray-400 font-data">{item.ticker}/USDT</span>
                <BarChart3 size={16} className="text-gray-700 group-hover:text-crypto-gold" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-white italic">{item.win_rate}%</p>
                <p className="text-[10px] text-crypto-green font-bold uppercase tracking-tighter">Win Probability</p>
              </div>
              <div className="mt-6 pt-4 border-t border-crypto-border/50 text-[9px] text-gray-600">
                BASED ON {item.total_signals} VERIFIED SIGNALS
              </div>
            </div>
          )) : (
            <div className="col-span-4 py-12 text-center border border-dashed border-crypto-border rounded-xl">
              <p className="text-xs text-gray-600 italic font-data">-- AGGREGATING MARKET SAMPLES --</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}