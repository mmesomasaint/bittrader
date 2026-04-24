"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("LOGIN FAILED", {
        description: "There was an error logging you in.",
        icon: <AlertCircle className="text-crypto-red" size={16} />,
      });
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh(); // Ensure the layout recognizes the new session
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase block tracking-widest">
            Identity / Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="email" 
              className="w-full bg-crypto-bg border border-crypto-border p-3 pl-10 rounded text-white font-data text-sm focus:border-crypto-gold outline-none transition"
              placeholder="operator@optimalogic.ai"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase block tracking-widest">
            Security / Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="password" 
              className="w-full bg-crypto-bg border border-crypto-border p-3 pl-10 rounded text-white font-data text-sm focus:border-crypto-gold outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-crypto-gold text-black font-black py-4 rounded uppercase tracking-widest hover:bg-[#fcd535] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Session"}
        </button>
      </form>

      <div className="pt-4 border-t border-crypto-border text-center">
        <p className="text-[10px] text-gray-600 uppercase font-bold">
          New Operator?{" "}
          <Link href="/signup" className="text-crypto-gold hover:underline">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}