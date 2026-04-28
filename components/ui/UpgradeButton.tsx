"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PaystackPop from "@paystack/inline-js";
import { useUser } from "@/hooks/use-user";
import { Loader2, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function UpgradeButton() {
  const { user } = useUser();
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    if (!user?.email || !user?.id) {
      toast.error("AUTH_ERROR", { description: "User session not found." });
      return;
    }

    setIsInitializing(true);
    
    try {
      const paystack = new PaystackPop();
      
      const options: any = {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: user.email,
        amount: 125000 * 100, 
        planCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE, 
        metadata: {
          user_id: user.id // Pass the ID so the verification knows who to upgrade
        },
        onSuccess: async (transaction: any) => {
          // Paystack returns a 'reference' (e.g., T123456789)
          const reference = transaction.reference;
          
          toast.loading("VERIFYING_AUTHORIZATION...", { id: "verify-payment" });

          try {
            // Call our new verification API
            const response = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference, userId: user.id }),
            });

            if (response.ok) {
              toast.success("ELITE_STATUS_ACTIVE", { 
                id: "verify-payment",
                icon: <CheckCircle2 className="text-crypto-green" size={16} /> 
              });
              // Hard refresh to ensure useUser hooks get the fresh tier
              router.push("/dashboard?upgrade=success");
              router.refresh();
            } else {
              throw new Error("Verification failed");
            }
          } catch (err) {
            toast.error("SYNC_DELAY", { 
              id: "verify-payment",
              description: "Payment successful, but tier sync is taking a moment. Please refresh." 
            });
            router.push("/dashboard");
            router.refresh();
          } finally {
            setIsInitializing(false);
          }
        },
        onCancel: () => {
          setIsInitializing(false);
          toast.info("PAYMENT_CANCELLED");
        },
        onError: (error: any) => {
          setIsInitializing(false);
          toast.error("GATEWAY_ERROR");
        }
      };

      paystack.newTransaction(options);
    } catch (err) {
      setIsInitializing(false);
      toast.error("INITIALIZATION_FAILED");
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isInitializing}
      className="w-full bg-crypto-gold text-black font-black py-4 rounded-lg uppercase tracking-widest hover:bg-[#fcd535] transition-all flex items-center justify-center gap-2"
    >
      {isInitializing ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} fill="currentColor" /> Initialize Elite Access</>}
    </button>
  );
}
