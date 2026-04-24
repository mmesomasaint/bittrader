"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) {
        toast.error("SIGN_UP FAILED", {
          description: "There was an error creating your account.",
          icon: <AlertCircle className="text-crypto-red" size={16} />,
        });
    }
    else router.push("/dashboard"); // Trigger above handles profile creation
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Institutional Email</label>
        <input 
          type="email" 
          className="w-full bg-crypto-bg border border-crypto-border p-3 rounded text-white focus:border-crypto-gold outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Access Password</label>
        <input 
          type="password" 
          className="w-full bg-crypto-bg border border-crypto-border p-3 rounded text-white focus:border-crypto-gold outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="w-full bg-crypto-gold text-black font-black py-4 rounded uppercase tracking-widest hover:bg-[#fcd535] transition">
        
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Initialize Account"}
      </button>
    </form>
  );
}