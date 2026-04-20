"use client";
import { useState } from "react";
import { ShieldCheck, Trash2, Globe, Lock } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { UpgradeModal } from "@/components/system/UpgradeModal";

const EXCHANGES = [
  { id: 'bybit', name: 'Bybit', color: 'text-[#F0B90B]', bg: 'bg-[#F0B90B]/10' },
  { id: 'binance', name: 'Binance', color: 'text-[#0ECB81]', bg: 'bg-[#0ECB81]/10' }
];

export default function MultiExchangeSettings() {
  const { isPro, loading } = useUser();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeKeys, setActiveKeys] = useState(['bybit']);

  const handleProtectedAction = (e?: any) => {
    if (!isPro) {
      if (e) e.preventDefault();
      setShowUpgrade(true);
      return false;
    }
    return true;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <header className="border-b border-crypto-border pb-6">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Exchange Vault</h1>
        <p className="text-sm text-gray-500 font-data">Manage institutional-grade API connections.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EXCHANGES.map((ex) => (
          <div key={ex.id} className="bg-crypto-card border border-crypto-border rounded-2xl overflow-hidden flex flex-col relative">
            {/* Locked Overlay for UI Polish */}
            {!isPro && !loading && (
              <div className="absolute top-2 right-2 text-gray-600">
                <Lock size={14} />
              </div>
            )}

            <div className={`p-4 ${ex.bg} border-b border-crypto-border flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <Globe size={16} className={ex.color} />
                <span className={`font-bold uppercase text-xs ${ex.color}`}>{ex.name} PERPETUALS</span>
              </div>
              {activeKeys.includes(ex.id) && (
                <span className="text-[9px] bg-crypto-green/20 text-crypto-green px-2 py-0.5 rounded font-bold">CONNECTED</span>
              )}
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-600 font-bold uppercase">API Key</label>
                <input 
                  disabled={!isPro}
                  type="text" 
                  className="w-full bg-crypto-bg border border-crypto-border p-3 rounded-lg text-white font-data text-sm focus:border-crypto-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={isPro ? `${ex.name}_KEY_...` : "Upgrade to unlock API entry"}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-600 font-bold uppercase">Secret Key</label>
                <input 
                  disabled={!isPro}
                  type="password" 
                  className="w-full bg-crypto-bg border border-crypto-border p-3 rounded-lg text-white font-data text-sm focus:border-crypto-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="p-4 bg-black/20 flex gap-2">
              <button 
                onClick={handleProtectedAction}
                className="flex-1 bg-white text-black font-black py-3 rounded-lg hover:bg-gray-200 transition text-sm uppercase tracking-tighter"
              >
                UPDATE {ex.name.toUpperCase()}
              </button>
              <button className="p-3 border border-crypto-red/30 text-crypto-red hover:bg-crypto-red/10 rounded-lg transition">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Global Risk Control Card */}
      <div className={`bg-crypto-card border border-crypto-red/20 rounded-2xl p-6 border-l-4 border-l-crypto-red transition-opacity ${!isPro ? 'opacity-75' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-crypto-red" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm italic">Risk Management Protocols</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-crypto-bg rounded-lg border border-crypto-border">
          <div>
            <p className="text-sm font-bold text-white">Cross-Exchange Sync</p>
            <p className="text-xs text-gray-500 font-data">Duplicate trades on both Binance and Bybit simultaneously.</p>
          </div>
          <input 
            type="checkbox" 
            className="w-5 h-5 accent-crypto-gold cursor-pointer" 
            onClick={handleProtectedAction}
            onChange={(e) => { if(!isPro) e.target.checked = false; }}
          />
        </div>
      </div>
    </div>
  );
}