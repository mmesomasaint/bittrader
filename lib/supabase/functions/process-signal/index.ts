import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    // 1. Validate incoming signal
    const { ticker, sentiment, handle_id, reasoning, raw_text } = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 2. Fetch all users tracking this specific intelligence source
    const { data: subscribers, error } = await supabase
    .from('intel_sources')
    .select(`
      user_id,
      weight,
      profiles ( tier )
    `)
    .eq('twitter_handle_id', handle_id)

    if (error || !subscribers) return new Response("No subscribers found", { status: 200 });

    const results = await Promise.all(subscribers.map(async (sub: any) => {
    // Supabase returns joined tables as an array if the relationship isn't explicitly defined as single
    const profile = Array.isArray(sub.profiles) ? sub.profiles[0] : sub.profiles;
    const isFreeTier = profile?.tier === 'free';
    
    // 3. Record the Intelligence in the user's feed
    await supabase.from('intel_logs').insert({
      user_id: sub.user_id,
      ticker,
      sentiment,
      reasoning,
      is_ghost_signal: isFreeTier
    });

    if (isFreeTier) {
      return { user_id: sub.user_id, status: 'ghost_logged' };
    } else {
      await supabase.from('trade_queue').insert({
        user_id: sub.user_id,
        ticker,
        action: sentiment === 'bullish' || sentiment > 0 ? 'BUY' : 'SELL',
        weight: sub.weight
      });
      return { user_id: sub.user_id, status: 'trade_queued' };
    }
}));

  return NextResponse.json({ success: true, processed: results.length });
  
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
