"use client";
import { Lock, Zap, ShieldCheck } from "lucide-react";
import { UpgradeButton } from "../ui/UpgradeButton";

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-crypto-card border border-crypto-gold/30 max-w-md w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(240,185,11,0.1)]">
        <div className="bg-crypto-gold p-1 text-center text-[10px] font-black text-black uppercase tracking-widest">
          Limited Access Detected
        </div>
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-crypto-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-crypto-gold" size={28} />
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2 italic uppercase">Upgrade to Pro</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Automated execution on <span className="text-white font-bold">Binance & Bybit</span> is restricted to Pro Operators. Your current tier only permits Signal Observation.
          </p>

          <div className="space-y-3 mb-8">
            {[
              "1.90ms Execution Priority",
              "Multi-Exchange Sync",
              "Advanced Risk Management"
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-[11px] text-gray-300 font-bold uppercase tracking-tighter">
                <Zap size={12} className="text-crypto-gold" /> {feat}
              </div>
            ))}
          </div>

          <UpgradeButton />
          <button onClick={onClose} className="text-[10px] text-gray-600 uppercase font-bold hover:text-white transition">
            Continue as Observer
          </button>
        </div>
      </div>
    </div>
  );
}