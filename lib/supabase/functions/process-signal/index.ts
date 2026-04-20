import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
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

  const results = await Promise.all(subscribers.map(async (sub) => {
    const isFreeTier = sub.profiles.tier === 'free';
    
    // 3. Record the Intelligence in the user's feed
    await supabase.from('intel_logs').insert({
      user_id: sub.user_id,
      ticker,
      sentiment,
      reasoning,
      is_ghost_signal: isFreeTier
    });

    if (isFreeTier) {
      // Logic for Free Users: Just notify via Telegram, no trade
      return { user_id: sub.user_id, status: 'ghost_logged' };
    } else {
      // Logic for Paid Users: Queue a trade job for the Execution Engine
      // We insert into a 'trade_queue' table that your VPS listens to
      await supabase.from('trade_queue').insert({
        user_id: sub.user_id,
        ticker,
        action: sentiment > 0 ? 'BUY' : 'SELL',
        weight: sub.weight
      });
      return { user_id: sub.user_id, status: 'trade_queued' };
    }
  }));

  return new Response(JSON.stringify({ processed: results.length }), {
    headers: { "Content-Type": "application/json" },
  })
})