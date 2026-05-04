import Link from "next/link";
import { Zap, Shield, BarChart3, ChevronRight, Globe, Cpu, Check, X } from "lucide-react";
import WinRateShowcase from "@/components/system/WinRateShowcase";
import LiveTicker from "@/components/system/LiveTicker";

export default function LandingPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-crypto-gold selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-crypto-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-8">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crypto-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-crypto-green"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Node_SG-01 Online</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8 uppercase">
              Hunt the Market <br /> 
              <span className="text-crypto-gold">At 1.90ms.</span>
            </h1>
            
            <p className="max-w-2xl text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-10">
              BitTrader is an AI-native lead generation and automated execution infrastructure. Built for founders who trade with institutional velocity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-crypto-gold transition-all flex items-center gap-2 group">
                Deploy System <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all">
                Operator Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROOF (Your WinRateShowcase Component) */}
      <WinRateShowcase />

      {/* 3. PRICING SECTION (THE ADDITION) */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Choose Your Clearance</h2>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Select an operational tier to begin execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-3xl space-y-8">
              <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Tier_01</h3>
                <p className="text-3xl font-black italic uppercase">Observer</p>
                <p className="text-5xl font-black mt-4">$0<span className="text-sm font-normal text-gray-600 tracking-normal">/mo</span></p>
              </div>
              <ul className="space-y-4 border-y border-white/5 py-8">
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-crypto-green" /> Real-time Intel Feed</li>
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-crypto-green" /> Confidence Scoring</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><X size={16} /> Automated Execution</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><X size={16} /> Multi-Exchange Sync</li>
              </ul>
              <Link href="/signup" className="block text-center border border-white/10 py-4 rounded-xl font-bold uppercase text-xs hover:bg-white/5 transition">
                Start Observing
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#0A0A0A] border-2 border-crypto-gold p-10 rounded-3xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-crypto-gold text-black text-[9px] font-black px-4 py-1 uppercase tracking-widest">Recommended</div>
              <div>
                <h3 className="text-xs font-black text-crypto-gold uppercase tracking-[0.2em] mb-2">Tier_02</h3>
                <p className="text-3xl font-black italic uppercase">Pro Operator</p>
                <p className="text-5xl font-black mt-4">₦125,000<span className="text-sm font-normal text-gray-600 tracking-normal">/mo</span></p>
              </div>
              <ul className="space-y-4 border-y border-white/5 py-8">
                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-crypto-gold" /> Automated Bybit Execution</li>
                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-crypto-gold" /> Automated Binance Execution</li>
                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-crypto-gold" /> Risk Management V4</li>
                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-crypto-gold" /> Telegram Trade Alerts</li>
              </ul>
              <Link href="/signup?plan=pro" className="block text-center bg-crypto-gold text-black py-4 rounded-xl font-black uppercase text-xs hover:bg-[#fcd535] transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)]">
                Initialize Pro Access
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES (The Tech) */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Cpu size={24} className="text-crypto-gold" />
              </div>
              <h3 className="text-xl font-bold uppercase italic italic">Neural Execution</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-data">
                Proprietary AI filters noise and identifies high-intent liquidity shifts before they hit the public tape.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Globe size={24} className="text-crypto-gold" />
              </div>
              <h3 className="text-xl font-bold uppercase italic">Multi-Exchange Sync</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-data">
                Simultaneous execution across Binance and Bybit with millisecond parity. One dashboard to rule the ocean.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Shield size={24} className="text-crypto-gold" />
              </div>
              <h3 className="text-xl font-bold uppercase italic">Risk Protocol V4</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-data">
                Automated drawdown protection and balance-aware position sizing. We protect the capital first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPERATOR FEEDBACK (Testimonials) */}
      <section className="py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Field Reports</h2>
              <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Verified Operator Feedback // 2026_Q2</p>
            </div>
            <div className="h-[1px] flex-1 bg-white/10 mx-8 hidden md:block mb-4"></div>
            <div className="text-right">
              <span className="text-crypto-gold font-black text-4xl">40+</span>
              <p className="text-[10px] text-gray-600 uppercase font-bold">Active Nodes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Tony_O",
                role: "Scalp Specialist",
                body: "The multi-exchange sync is flawless. I'm hitting entries on Binance and Bybit simultaneously with zero slippage. This isn't a bot, it's an edge.",
                profit: "+22.4%"
              },
              {
                name: "Michael_X",
                role: "Systems Architect",
                body: "BitTrader's neural filtering caught the SOL flip 4 minutes before the major CT accounts posted it. The Risk V4 module paid for itself in one trade.",
                profit: "+18.9%"
              },
              {
                name: "Chinoso_V",
                role: "Institutional Lead",
                body: "The dark-themed industrial UI makes long monitoring sessions easy on the eyes. High-intent liquidity shifts are finally visible.",
                profit: "+31.2%"
              }
            ].map((report, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl relative group hover:border-crypto-gold/30 transition-colors">
                <div className="absolute top-4 right-6 font-mono text-[10px] text-crypto-green opacity-50">{report.profit}</div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-crypto-gold/10 rounded flex items-center justify-center border border-crypto-gold/20">
                    <span className="text-crypto-gold font-black text-[10px]">{report.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase italic">{report.name}</p>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">{report.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic font-medium">"{report.body}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SYSTEM DOCUMENTATION (FAQ) */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-12 text-center">System_Protocol_FAQ</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "HOW SECURE ARE MY API KEYS?",
                a: "Keys are encrypted using AES-256-GCM at the hardware level. BitTrader never requests withdrawal permissions. Your capital stays in your exchange vault."
              },
              {
                q: "WHAT IS THE AVERAGE EXECUTION LATENCY?",
                a: "Internal node processing is sub-2ms. Final execution depends on exchange API response times, typically averaging 40-120ms globally."
              },
              {
                q: "CAN I RUN CUSTOM X (TWITTER) ALPHA SOURCES?",
                a: "Pro Operators can link up to 5 custom X handles. Our Neural Engine filters these in real-time to identify high-intent market signals."
              },
              {
                q: "DOES THE BOT TRADE WHILE I AM OFFLINE?",
                a: "Yes. Black Marlin runs on dedicated industrial-grade VPS infrastructure. Once deployed, execution is 24/7 until manually deactivated."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-black border border-white/5 rounded-xl overflow-hidden">
                <summary className="list-none p-6 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-colors">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 group-open:text-crypto-gold">
                    [0{i+1}] {faq.q}
                  </span>
                  <ChevronRight size={16} className="text-gray-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-500 font-data leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-8">Ready to Scale?</h2>
          <p className="text-gray-500 mb-12 font-data uppercase tracking-widest text-sm">Join Tony and 40+ other operators running BitTrader.</p>
          <Link href="/signup" className="inline-block bg-crypto-gold text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-20 pb-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">Bit<span className="text-crypto-gold">.</span>Trader</h3>
            <p className="text-gray-600 text-xs uppercase leading-relaxed max-w-sm tracking-wider">
              BitTrader is an AI-native lead generation and automated execution infrastructure. 
              Engineered by Optima Logic Venture Studio for high-frequency institutional advantage.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white mb-6 tracking-widest">Protocols</h4>
            <ul className="space-y-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <li><Link href="/guidance" className="hover:text-crypto-gold transition">Guideline</Link></li>
              <li><Link href="/login" className="hover:text-crypto-gold transition">Terminal Login</Link></li>
              <li><Link href="/signup" className="hover:text-crypto-gold transition">Activate Session</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white mb-6 tracking-widest">Studio</h4>
            <ul className="space-y-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <li><Link href="https://optimalogic.studio" className="hover:text-crypto-gold transition">Optima Logic</Link></li>
              <li><Link href="#" className="hover:text-crypto-gold transition">Risk Protocol V4</Link></li>
              <li><Link href="https://optimalogic.studio/status" className="hover:text-crypto-gold transition">Studio Status</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pb-10">
           <p className="text-[9px] text-gray-800 font-bold uppercase tracking-[0.5em]">
            © 2026 Optima Logic Venture Studio // All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* THE TICKER - FIXED AT BOTTOM */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <LiveTicker />
      </div>
    </div>
  );
}
