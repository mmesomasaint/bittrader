"use client";
import { useEffect, useState } from 'react';
import { Target, BarChart3, ShieldCheck } from "lucide-react";

export default function WinRateShowcase() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/public/performance')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats([]));
  }, []);

  return (
    <section className="py-24 border-y border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Verified Accuracy</h2>
            <p className="text-gray-500 font-mono text-xs max-w-md">
              Real-time success rates calculated across institutional order books. 100% Transparency.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded flex items-center gap-2">
            <ShieldCheck size={14} className="text-crypto-green" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Audit Status: PASS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.length > 0 ? stats.map((item) => (
            <div key={item.ticker} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl hover:border-crypto-gold transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-black text-gray-500 font-mono">{item.ticker}/USDT</span>
                <BarChart3 size={16} className="text-gray-700 group-hover:text-crypto-gold" />
              </div>
              <div className="space-y-1">
                <p className="text-5xl font-black text-white italic tracking-tighter">{item.win_rate}%</p>
                <p className="text-[10px] text-crypto-green font-bold uppercase tracking-tighter">Win Probability</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-gray-600 font-mono">
                BASED ON {item.total_signals} VERIFIED SIGNALS
              </div>
            </div>
          )) : (
            /* Mock placeholders for initial load/empty state */
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-xl animate-pulse">
                <div className="h-4 w-20 bg-white/5 mb-6 rounded" />
                <div className="h-10 w-24 bg-white/5 mb-2 rounded" />
                <div className="h-2 w-full bg-white/5 rounded" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}