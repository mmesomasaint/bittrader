import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  // Fetch top 4 performing tickers with at least 10 signals for credibility
  const { data, error } = await supabase
    .from('ticker_stats')
    .select('ticker, win_rate, total_signals')
    .gt('total_signals', 10)
    .order('win_rate', { ascending: false })
    .limit(4);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}