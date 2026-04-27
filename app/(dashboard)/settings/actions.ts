"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/crypto";

export async function updateApiKeys(formData: FormData) {
  const supabase = await createClient();
  
  // Get user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  
  // Extract and Validate
  const rawKey = formData.get('api_key');

  // We check if it's a string and not null
  if (typeof rawKey !== 'string' || !rawKey) {
     return { success: false, error: "A valid API Key string is required." };
  }
  
  // Now TypeScript knows for 100% certainty that rawKey is a string
  const encryptedKey = encrypt(rawKey);

  // Upsert to public.api_keys
  const { error } = await supabase
    .from('api_keys')
    .upsert({ 
      user_id: user.id, 
      encrypted_key: encryptedKey,
      exchange_name: 'bybit'
    });


  if (error) {
    console.error("Vault Update Error:", error.message);
    return { success: false, error: error.message };
  }

  // 4. Clear cache to show updated status
  revalidatePath('/dashboard/settings');
  return { success: true };
}
