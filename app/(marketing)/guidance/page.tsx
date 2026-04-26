"use client";
import { Book, Shield, Zap, Terminal, ChevronRight, Cpu } from "lucide-react";

const SECTIONS = [
  {
    id: 'protocol',
    title: 'BITTRADER_PROTOCOL',
    icon: Zap,
    content: "The BitTrader engine utilizes high-velocity volume analysis and liquidity gap identification. It is designed to find 'the move before the move' by tracking whale net-flow across Binance and Bybit."
  },
  {
    id: 'security',
    title: 'VAULT_SECURITY',
    icon: Shield,
    content: "API keys are never stored in plain text. They are encrypted at the edge and only decrypted within the execution runtime environment. We recommend IP-whitelisting the SG-01-EXECUTOR node for maximum safety."
  },
  {
    id: 'execution',
    title: 'TRADE_EXECUTION',
    icon: Cpu,
    content: "Execution latency is currently benchmarked at 1.90ms. Manual overrides can be triggered via the Intelligence Core, but the automated executor will always prioritize risk-adjusted entry points."
  }
];

export default function GuidancePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-crypto-bg min-h-screen font-mono">
      {/* Header */}
      <header className="border-b border-white/5 pb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Operations_Manual v1.0</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Subject: Institutional-Grade Speculation Infrastructure</p>
      </header>

      {/* Hero: The Workflow Diagram */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Terminal size={120} />
        </div>
        <h3 className="text-xs font-black text-white uppercase mb-6 flex items-center gap-2">
          <Book size={14} className="text-crypto-gold" /> System_Hierarchy
        </h3>
        
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-crypto-gold text-[10px] font-black mb-1">01_SCAN</p>
            <p className="text-[10px] text-gray-400">BitTrader scanner identifies volume anomalies and order book imbalances.</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-crypto-gold text-[10px] font-black mb-1">02_ANALYZE</p>
            <p className="text-[10px] text-gray-400">Reasoning engine assigns a confidence score based on historical win-rates.</p>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-crypto-gold text-[10px] font-black mb-1">03_EXECUTE</p>
            <p className="text-[10px] text-gray-400">Executor node deploys capital to Bybit/Binance within 1.90ms of signal.</p>
          </div>
        </div>
      </div>

      {/* Deep Dive Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.id} className="group border-l-2 border-white/5 hover:border-crypto-gold transition-all pl-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <section.icon size={18} className="text-gray-500 group-hover:text-crypto-gold transition-colors" />
              <h2 className="text-lg font-black text-white italic tracking-tight">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl font-sans">
              {section.content}
            </p>
            <button className="mt-4 flex items-center gap-1 text-[10px] font-black text-crypto-gold uppercase tracking-widest hover:gap-2 transition-all">
              View Technical Specs <ChevronRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Support Footer */}
      <footer className="bg-crypto-card border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
        <p className="text-xs text-gray-500 uppercase font-black mb-4">Still Encountering Friction?</p>
        <button className="bg-white text-black px-8 py-3 rounded-lg font-black text-xs uppercase hover:bg-gray-200 transition-all">
          Contact System Administrator
        </button>
      </footer>
    </div>
  );
}
