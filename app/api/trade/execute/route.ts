import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import ccxt from 'ccxt';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { signalId, exchange: exchangeId } = await req.json();

  // GATEKEEPER: Session & Tier Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (profile?.tier !== 'pro') return NextResponse.json({ error: 'UPGRADE_REQUIRED' }, { status: 403 });

  // VAULT: Key Retrieval
  const apiKey = profile[`${exchangeId}_key`];
  const apiSecret = profile[`${exchangeId}_secret`];
  if (!apiKey || !apiSecret) return NextResponse.json({ error: 'VAULT_EMPTY', message: 'No API credentials found.' }, { status: 400 });

  // INTEL: Signal Verification
  const { data: signal } = await supabase.from('intel_logs').select('*').eq('id', signalId).single();
  if (!signal) return NextResponse.json({ error: 'INVALID_SIGNAL' }, { status: 404 });

  try {
    // NODE: Initialize CCXT Client
    const exchange = new (ccxt as any)[exchangeId]({
      apiKey,
      secret: apiSecret,
      enableRateLimit: true,
      options: { 'defaultType': 'swap' } // Ensure we are on Perpetuals/Futures
    });

    const symbol = `${signal.ticker}/USDT:USDT`; // Format for Linear Perpetuals
    const side = signal.sentiment === 'bullish' ? 'buy' : 'sell';

    // RISK_ENGINE: Practical Position Sizing
    // We fetch balance to ensure we don't 'Over-Leverage'
    const balance = await exchange.fetchBalance();
    const availableUsdt = balance.total.USDT || 0;
    
    if (availableUsdt < 10) {
      return NextResponse.json({ error: 'INSUFFICIENT_FUNDS', message: 'Minimum 10 USDT required for node execution.' }, { status: 400 });
    }

    // Practical Logic: Risking 2% of total balance on this signal
    // For $1,000 balance, this is a $20 position
    const amountInUsdt = availableUsdt * 0.02; 
    
    // Fetch current price to calculate quantity
    const ticker = await exchange.fetchTicker(symbol);
    const quantity = amountInUsdt / ticker.last;

    // EXECUTE: The Heavy Lift
    const order = await exchange.createMarketOrder(symbol, side, quantity);

    // LOG: Record the manual execution in the 'trades' table
    await supabase.from('trades').insert({
      user_id: user.id,
      symbol: signal.ticker,
      side: side,
      entry_price: order.price || ticker.last,
      status: 'open',
      exchange: exchangeId,
      order_id: order.id
    });

    return NextResponse.json({ 
      success: true, 
      message: `SYSTEM_EXECUTED: ${side.toUpperCase()} ${quantity.toFixed(2)} ${signal.ticker}`,
      orderId: order.id 
    });

  } catch (err: any) {
    // Handle specific Exchange Errors
    let errorType = 'EXECUTION_FAILED';
    if (err instanceof ccxt.AuthenticationError) errorType = 'INVALID_API_KEYS';
    if (err instanceof ccxt.InsufficientFunds) errorType = 'MARGIN_INSUFFICIENT';

    return NextResponse.json({ 
      error: errorType, 
      message: err.message.slice(0, 100) // Truncate long error strings
    }, { status: 500 });
  }
}
