"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/crypto";

export async function updateApiKeys(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "UNAUTHORIZED" };

  const rawKey = formData.get('api_key') as string;
  const rawSecret = formData.get('api_secret') as string;
  const exchange = formData.get('exchange') as string; // 'bybit' or 'binance'

  if (!rawKey || !rawSecret) {
    return { success: false, error: "Both Key and Secret are required." };
  }

  // Encrypt keys before they touch the database
  const encryptedKey = encrypt(rawKey);
  const encryptedSecret = encrypt(rawSecret);

  // Prepare the dynamic update object
  const updates: any = {};
  if (exchange === 'bybit') {
    updates.bybit_api_key = encryptedKey;
    updates.bybit_secret = encryptedSecret;
  } else if (exchange === 'binance') {
    updates.binance_api_key = encryptedKey;
    updates.binance_secret = encryptedSecret;
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    console.error("Vault Update Error:", error.message);
    return { success: false, error: "Database Sync Failed" };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}
