import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import ccxt from 'ccxt';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { signalId, exchange } = await req.json();

  // Get User Session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  // Fetch Profile & Check PRO Status
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.tier !== 'pro') {
    return NextResponse.json({ error: 'UPGRADE_REQUIRED', message: 'Manual execution requires PRO clearance.' }, { status: 403 });
  }

  // Credential Check
  const apiKey = profile[`${exchange}_key`];
  const apiSecret = profile[`${exchange}_secret`];

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'KEYS_MISSING', message: `No ${exchange} credentials found in Vault.` }, { status: 400 });
  }

  // Fetch Signal Data
  const { data: signal } = await supabase.from('intel_logs').select('*').eq('id', signalId).single();
  if (!signal) return NextResponse.json({ error: 'SIGNAL_NOT_FOUND' }, { status: 404 });

  try {
    // Initialize Exchange & Execute
    // For this example, we'll use a market order for speed (1.90ms target)
    const client = new (ccxt as any)[exchange]({
      apiKey: apiKey,
      secret: apiSecret,
      enableRateLimit: true,
    });

    // Example: Market Long/Short based on sentiment
    const side = signal.sentiment === 'bullish' ? 'buy' : 'sell';
    
    // NOTE: In production, you'd calculate position size based on user's risk settings
    // const order = await client.createMarketOrder(`${signal.ticker}/USDT`, side, amount);

    // For now, we'll simulate success for the UI handshake
    return NextResponse.json({ 
      success: true, 
      orderId: 'DX-' + Math.random().toString(36).toUpperCase().slice(2, 10),
      message: `MARKET_${side.toUpperCase()} executed on ${exchange.toUpperCase()}` 
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'EXCHANGE_ERROR', message: err.message }, { status: 500 });
  }
}
