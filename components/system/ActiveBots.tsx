import { Cpu, Zap } from 'lucide-react';

export function ActiveBots() {
  const bots = [
    { name: 'X-Sentiment Alpha', pair: 'BTC/USDT', status: 'Running', uptime: '12d 4h' },
    { name: 'News-Flash Bot', pair: 'ETH/USDT', status: 'Running', uptime: '5d 22h' },
  ];

  return (
    <div className="card-binance h-full">
      <h3 className="font-bold mb-6 flex items-center gap-2">
        <Cpu size={18} className="text-binance-yellow" />
        Active Workers
      </h3>
      <div className="space-y-4">
        {bots.map((bot, i) => (
          <div key={i} className="p-4 bg-binance-black rounded border border-binance-border">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold">{bot.name}</span>
              <div className="flex items-center gap-1.5 text-[10px] text-binance-green font-bold uppercase">
                <div className="w-1.5 h-1.5 bg-binance-green rounded-full animate-pulse" />
                {bot.status}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Target: <span className="text-white">{bot.pair}</span></span>
              <span>Uptime: <span className="text-white">{bot.uptime}</span></span>
            </div>
          </div>
        ))}
        <button className="w-full py-2 border border-dashed border-binance-border text-gray-500 text-xs rounded hover:border-binance-yellow hover:text-binance-yellow transition-colors">
          + Deploy New Worker
        </button>
      </div>
    </div>
  );
}