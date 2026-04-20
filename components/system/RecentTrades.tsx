export function RecentTrades() {
  const trades = [
    { pair: 'BTC/USDT', side: 'LONG', pnl: '+$140.20', time: '2 mins ago', status: 'CLOSED' },
    { pair: 'ETH/USDT', side: 'SHORT', pnl: '+$45.10', time: '1 hour ago', status: 'CLOSED' },
    { pair: 'SOL/USDT', side: 'LONG', pnl: '-$12.00', time: '3 hours ago', status: 'GHOST' },
  ];

  return (
    <div className="card-binance h-full">
      <h3 className="font-bold mb-6 flex items-center justify-between">
        Recent Activity
        <span className="text-xs text-binance-yellow cursor-pointer hover:underline">View All</span>
      </h3>
      <div className="space-y-4">
        {trades.map((trade, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-binance-border last:border-0">
            <div>
              <p className="font-bold text-sm">{trade.pair}</p>
              <p className={`text-[10px] font-bold ${trade.side === 'LONG' ? 'text-binance-green' : 'text-binance-red'}`}>{trade.side}</p>
            </div>
            <div className="text-right">
              <p className={`font-mono font-bold ${trade.pnl.includes('+') ? 'text-binance-green' : 'text-binance-red'}`}>{trade.pnl}</p>
              <p className="text-[10px] text-gray-500 uppercase">{trade.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}