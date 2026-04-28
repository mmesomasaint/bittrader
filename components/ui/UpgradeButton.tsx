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
    if (!user?.email || !user?.id) {
      toast.error("AUTH_ERROR");
      return;
    }

    setIsInitializing(true);
    
    try {
      const paystack = new PaystackPop();
      
          paystack.newTransaction({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
            email: user?.email || "",
            amount: 125000 * 100, // 125,000 NGN in kobo
            paymentRequest: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE, // Ensure this plan exists in your Paystack dashboard
            onSuccess: (transaction: any) => {
              setIsInitializing(false);
              toast.success("SYSTEM_AUTHORIZED", {
                description: "Pro account initialized",
                icon: <CheckCircle2 className="text-crypto-green" size={16} />,
              });
      
              // The webhook handles the tier upgrade; we just show a success state
              window.location.href = "/dashboard?payment=success";
            },
            onCancel: () => {
              setIsInitializing(false);
              toast.error("PAYMENT_CANCELLED", {
                description: "Your payment was cancelled.",
                icon: <AlertCircle className="text-crypto-red" size={16} />,
              });
            },
            onError: (error: any) => {
              setIsInitializing(false);
              console.error("Paystack Error:", error);
            }
          });
    } catch (err) {
      setIsInitializing(false);
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
