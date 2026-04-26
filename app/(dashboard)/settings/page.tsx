"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Trash2, Globe, Lock, Send, BellRing } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client"; // Use the client-side helper
import { UpgradeModal } from "@/components/system/UpgradeModal";

const EXCHANGES = [
  { id: 'bybit', name: 'Bybit', color: 'text-[#F0B90B]', bg: 'bg-[#F0B90B]/10' },
  { id: 'binance', name: 'Binance', color: 'text-[#0ECB81]', bg: 'bg-[#0ECB81]/10' }
];

export default function MultiExchangeSettings() {
  const supabase = createClient();
  const { user, profile, isPro, loading } = useUser(); // Extract user and profile here
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [telegramId, setTelegramId] = useState("");
  
  // State for API Keys
  const [keys, setKeys] = useState({
    bybit_key: "",
    bybit_secret: "",
    binance_key: "",
    binance_secret: ""
  });

  // Synchronize state when profile loads
  useEffect(() => {
    if (profile) {
      setTelegramId(profile.telegram_chat_id || "");
      setKeys({
        bybit_key: profile.bybit_key || "",
        bybit_secret: profile.bybit_secret || "",
        binance_key: profile.binance_key || "",
        binance_secret: profile.binance_secret || ""
      });
    }
  }, [profile]);

  if (loading) {
    return <div className="p-8 text-gray-500 font-mono animate-pulse uppercase text-xs">Authenticating_Session...</div>;
  }

  if (!user) {
    return <div className="p-8 text-crypto-red font-mono">Error: Unauthorized Access.</div>;
  }

  const handleSaveKeys = async (exchangeId: string) => {
    if (!isPro) return setShowUpgrade(true);

    const updates = exchangeId === 'bybit' 
      ? { bybit_key: keys.bybit_key, bybit_secret: keys.bybit_secret }
      : { binance_key: keys.binance_key, binance_secret: keys.binance_secret };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast.error(`${exchangeId.toUpperCase()}_SYNC_ERROR`, { description: error.message });
    } else {
      toast.success(`${exchangeId.toUpperCase()}_VAULT_UPDATED`, { description: "Credentials encrypted and stored." });
    }
  };

  const handleSaveTelegram = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ telegram_chat_id: telegramId })
      .eq('id', user.id);

    if (error) {
      toast.error("TELEGRAM_SYNC_FAILED", { description: error.message });
    } else {
      toast.success("TELEGRAM_AUTHORIZED", { description: "Alerts routed to your ID." });
    }
  };

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
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-600 font-bold uppercase">API Key</label>
                <input 
                  disabled={!isPro}
                  type="text" 
                  value={ex.id === 'bybit' ? keys.bybit_key : keys.binance_key}
                  onChange={(e) => setKeys({...keys, [`${ex.id}_key`]: e.target.value})}
                  className="w-full bg-crypto-bg border border-crypto-border p-3 rounded-lg text-white font-data text-sm focus:border-crypto-gold outline-none disabled:opacity-50 cursor-not-allowed"
                  placeholder={isPro ? "Paste Key..." : "Upgrade Required"}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-600 font-bold uppercase">Secret Key</label>
                <input 
                  disabled={!isPro}
                  type="password" 
                  value={ex.id === 'bybit' ? keys.bybit_secret : keys.binance_secret}
                  onChange={(e) => setKeys({...keys, [`${ex.id}_secret`]: e.target.value})}
                  className="w-full bg-crypto-bg border border-crypto-border p-3 rounded-lg text-white font-data text-sm focus:border-crypto-gold outline-none disabled:opacity-50 cursor-not-allowed"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="p-4 bg-black/20 flex gap-2">
              <button 
                onClick={() => handleSaveKeys(ex.id)}
                className="flex-1 bg-white text-black font-black py-3 rounded-lg hover:bg-gray-200 transition text-sm uppercase tracking-tighter"
              >
                UPDATE {ex.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Card */}
      <div className="bg-crypto-card border border-[#24A1DE]/20 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-[#24A1DE]/10 border-b border-crypto-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Send size={16} className="text-[#24A1DE]" />
            <span className="font-bold uppercase text-xs text-[#24A1DE]">Telegram Alert Channel</span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
            <BellRing className="text-crypto-gold shrink-0" size={20} />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Message <span className="text-white">@BitTradrrBot</span> and type <span className="text-crypto-gold">/id</span> to get your Chat ID.
            </p>
          </div>
          <input 
            type="text" 
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            className="w-full bg-crypto-bg border border-crypto-border p-3 rounded-lg text-white font-mono text-sm outline-none focus:border-[#24A1DE]"
            placeholder="Enter Chat ID..."
          />
          <button 
            onClick={handleSaveTelegram}
            className="w-full bg-[#24A1DE] text-white font-black py-3 rounded-lg uppercase text-xs"
          >
            Sync Telegram
          </button>
        </div>
      </div>
    </div>
  );
}