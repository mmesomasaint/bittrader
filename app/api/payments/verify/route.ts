import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { reference, userId } = await req.json();
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

    // 1. Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      const supabase = await createClient();
      
      // 2. Perform the actual upgrade in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ 
          tier: "elite", 
          is_pro: true,
          updated_at: new Date().toISOString() 
        })
        .eq("id", userId);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
