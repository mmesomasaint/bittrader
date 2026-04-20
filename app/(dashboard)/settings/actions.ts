export async function updateApiKeys(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Get user session
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Encrypt sensitive data
  const encryptedKey = encrypt(formData.get('api_key'));
  
  // 3. Upsert to public.api_keys
  const { error } = await supabase
    .from('api_keys')
    .upsert({ 
      user_id: user.id, 
      encrypted_key: encryptedKey,
      exchange_name: 'bybit'
    });

  if (!error) revalidatePath('/dashboard/settings');
}