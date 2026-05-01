"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Globe, Lock, Send, BellRing, Info, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { updateApiKeys } from "./actions";
import { UpgradeModal } from "@/components/system/UpgradeModal";

const EXCHANGES = [
  { id: 'bybit', name: 'Bybit', color: 'text-[#F0B90B]', bg: 'bg-[#F0B90B]/10' },
  { id: 'binance', name: 'Binance', color: 'text-[#0ECB81]', bg: 'bg-[#0ECB81]/10' }
];

export default function MultiExchangeSettings() {
  const supabase = createClient();
  const router = useRouter();
  const { user, profile, isPro, loading } = useUser();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [telegramId, setTelegramId] = useState("");
  const [keys, setKeys] = useState({ bybit_key: "", bybit_secret: "", binance_key: "", binance_secret: "" });
  
  // State to track which card is currently updating
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setTelegramId(profile.telegram_chat_id || "");
      setKeys({
        bybit_key: profile.bybit_api_key || "",
        bybit_secret: profile.bybit_secret || "",
        binance_key: profile.binance_api_key || "",
        binance_secret: profile.binance_secret || ""
      });
    }
  }, [profile]);

  if (loading) return <div className="p-8 text-[10px] text-gray-500 font-mono animate-pulse uppercase">Authenticating_Vault...</div>;

  const handleSaveKeys = async (exchangeId: string) => {
    if (!isPro) return setShowUpgrade(true);
    
    // Set loading for this specific exchange
    setUpdating(exchangeId);
  
    const formData = new FormData();
    if (exchangeId === 'bybit') {
      formData.append('api_key', keys.bybit_key);
      formData.append('api_secret', keys.bybit_secret);
      formData.append('exchange', 'bybit');
    } else {
      formData.append('api_key', keys.binance_key);
      formData.append('api_secret', keys.binance_secret);
      formData.append('exchange', 'binance');
    }
  
    try {
      const result = await updateApiKeys(formData);
      if (result.success) {
        toast.success("VAULT_UPDATED");
      } else {
        toast.error(result.error || "SYNC_ERROR");
      }
    } catch (e) {
      toast.error("VAULT_CONNECTION_FAILED");
    } finally {
      // Clear loading state
      setUpdating(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-10 pb-24 lg:pb-8">
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <header className="border-b border-crypto-border pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Exchange Vault</h1>
        <p className="text-[10px] md:text-sm text-gray-500 font-data">Manage institution-grade API keys.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {EXCHANGES.map((ex) => {
          const isBusy = updating === ex.id;
          
          return (
            <div key={ex.id} className="bg-crypto-card border border-crypto-border rounded-xl overflow-hidden flex flex-col relative transition-all duration-300">
              
              {/* SAVING OVERLAY: This keeps the user hopeful and prevents double-clicks */}
              {isBusy && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="text-crypto-gold animate-spin" />
                  <span className="text-[8px] font-black text-white tracking-[0.2em] animate-pulse">ENCRYPTING_VAULT</span>
                </div>
              )}

              {!isPro && <div className="absolute top-3 right-3 text-gray-600"><Lock size={14} /></div>}

              <div className={`p-4 ${ex.bg} border-b border-crypto-border flex items-center gap-2`}>
                <Globe size={16} className={ex.color} />
                <span className={`font-bold uppercase text-[10px] ${ex.color}`}>{ex.name} PERPETUALS</span>
              </div>

              <div className="p-5 md:p-6 space-y-4">
                <KeyInput 
                  label="API Key" 
                  value={ex.id === 'bybit' ? keys.bybit_key : keys.binance_key}
                  disabled={!isPro || isBusy}
                  onChange={(val: string) => setKeys({...keys, [`${ex.id}_key`]: val})}
                />
                <KeyInput 
                  label="Secret Key" 
                  value={ex.id === 'bybit' ? keys.bybit_secret : keys.binance_secret}
                  disabled={!isPro || isBusy}
                  type="password"
                  onChange={(val: string) => setKeys({...keys, [`${ex.id}_secret`]: val})}
                />
              </div>

              <div className="p-4 bg-black/20">
                <button 
                  disabled={isBusy}
                  onClick={() => handleSaveKeys(ex.id)}
                  className="w-full bg-white text-black font-black py-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 transition text-[10px] md:text-xs uppercase flex justify-center items-center gap-2"
                >
                  {isBusy ? "SYNCHRONIZING..." : `UPDATE ${ex.name} CONNECTION`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telegram Card - With similar individual loading logic */}
      <div className="bg-crypto-card border border-[#24A1DE]/20 rounded-xl overflow-hidden relative">
        {updating === 'telegram' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center gap-2">
            <Loader2 size={16} className="text-[#24A1DE] animate-spin" />
            <span className="text-[8px] font-black text-white">LINKING_CHANNEL</span>
          </div>
        )}
        <div className="p-4 bg-[#24A1DE]/10 border-b border-crypto-border flex items-center gap-2">
          <Send size={16} className="text-[#24A1DE]" />
          <span className="font-bold uppercase text-[10px] text-[#24A1DE]">Telegram Alert Route</span>
        </div>
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
            <Info className="text-crypto-gold shrink-0" size={16} />
            <p className="text-[9px] text-gray-500 leading-relaxed">
              Find <span className="text-white">@BitTradrrBot</span> to retrieve your <span className="text-crypto-gold italic">/id</span>.
            </p>
          </div>
          <input 
            type="text" 
            value={telegramId}
            disabled={updating === 'telegram'}
            onChange={(e) => setTelegramId(e.target.value)}
            className="w-full bg-crypto-bg border border-crypto-border p-4 rounded-lg text-white font-mono text-xs outline-none focus:border-[#24A1DE] disabled:opacity-50"
            placeholder="Chat ID..."
          />
          <button 
            disabled={updating === 'telegram'}
            onClick={async () => {
              setUpdating('telegram');
              const { error } = await supabase.from('profiles').update({ telegram_chat_id: telegramId }).eq('id', user?.id);
              if (!error) toast.success("TELEGRAM_LINKED");
              setUpdating(null);
            }}
            className="w-full bg-[#24A1DE] text-white font-black py-4 rounded-lg uppercase text-[10px] tracking-widest disabled:bg-gray-700"
          >
            Sync Channel
          </button>
        </div>
      </div>

      <div className="lg:hidden pt-10 pb-20">
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="w-full flex items-center justify-center gap-3 p-4 border border-crypto-red/20 bg-crypto-red/5 text-crypto-red rounded-xl font-black uppercase text-xs tracking-widest"
        >
          <LogOut size={16} /> Terminate_Active_Session
        </button>
      </div>
    </div>
  );
}


interface KeyInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  type?: string;
}

function KeyInput({ label, value, onChange, disabled, type = "text" }: KeyInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest">{label}</label>
      <input 
        disabled={disabled}
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-crypto-bg border border-crypto-border p-4 rounded-lg text-white font-data text-xs focus:border-crypto-gold outline-none disabled:opacity-30 transition-all"
        placeholder={disabled ? "PRO_REQUIRED" : `Enter ${label}...`}
      />
    </div>
  );
}
// KeyInput doesn't change, just ensure 'disabled' is passed correctly
