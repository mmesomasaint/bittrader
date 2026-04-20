"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) alert(error.message);
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
        Initialize Account
      </button>
    </form>
  );
}