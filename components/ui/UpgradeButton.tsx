"use client";
import { useState } from "react";
import PaystackPop from "@paystack/inline-js";
import { useUser } from "@/hooks/use-user";
import { Loader2, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function UpgradeButton() {
  const { user } = useUser();
  const [isInitializing, setIsInitializing] = useState(false);

  const handlePayment = () => {
    // Safety check: Don't initialize if user data hasn't loaded
    if (!user?.email || !user?.id) {
      toast.error("AUTH_ERROR", { description: "Session not found. Please re-login." });
      return;
    }

    setIsInitializing(true);
    
    try {
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: user.email,
        // If using a plan, remove 'amount' or ensure it matches exactly.
        // For a one-time payment of 125,000 NGN:
        amount: 125000 * 100, 
        // FIX: The property is 'plan', not 'paymentRequest'
        plan: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE || "", 
        metadata: {
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: user.id // Essential for your Supabase Webhook!
            }
          ]
        },
        onSuccess: (transaction: any) => {
          setIsInitializing(false);
          toast.success("SYSTEM_AUTHORIZED", {
            description: "Elite access granted.",
            icon: <CheckCircle2 className="text-crypto-green" size={16} />,
          });
          window.location.href = "/dashboard?payment=success";
        },
        onCancel: () => {
          setIsInitializing(false);
          toast.info("PAYMENT_CANCELLED");
        },
        onError: (error: any) => {
          setIsInitializing(false);
          console.error("Paystack Initialization Error:", error);
          toast.error("GATEWAY_ERROR", { description: "Could not connect to Paystack." });
        }
      });
    } catch (err) {
      setIsInitializing(false);
      console.error("Critical Crash:", err);
      toast.error("INITIALIZATION_FAILED");
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isInitializing}
      className="w-full bg-crypto-gold text-black font-black py-4 rounded-lg uppercase tracking-widest hover:bg-[#fcd535] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isInitializing ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <Zap size={18} fill="currentColor" />
          Initialize Elite Access
        </>
      )}
    </button>
  );
}
