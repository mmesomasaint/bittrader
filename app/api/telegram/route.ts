import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();
  const supabase = await createClient();

  if (message.text.startsWith('/start')) {
    const token = message.text.split(' ')[1]; // e.g., /start AUTH_TOKEN_123

    // Link the Telegram Chat ID to the user profile
    const { error } = await supabase
      .from('profiles')
      .update({ telegram_chat_id: message.chat.id })
      .eq('telegram_auth_token', token);

    if (!error) {
      // Send confirmation back to user via Telegram API
      return NextResponse.json({ status: 'linked' });
    }
  }

  return NextResponse.json({ status: 'ok' });
}