export function IntelCard({ user, time, content, reasoning, sentiment, action }: any) {
  return (
    <div className="card-binance border-l-4 border-binance-yellow transition-transform hover:scale-[1.01]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 text-[10px] font-bold">X</span>
          </div>
          <span className="font-bold text-sm">@{user}</span>
          <span className="text-gray-500 text-xs">• {time}</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${sentiment > 0 ? 'bg-binance-green/20 text-binance-green' : 'bg-binance-red/20 text-binance-red'}`}>
          SENTIMENT: {sentiment}
        </div>
      </div>
      
      <p className="text-sm mb-4 leading-relaxed">{content}</p>
      
      <div className="bg-binance-black p-3 rounded border border-binance-border mb-4">
        <p className="text-[10px] font-bold text-binance-yellow uppercase mb-1">Optima AI Reasoning</p>
        <p className="text-xs text-gray-400 italic">{reasoning}</p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-binance-border">
        <span className="text-[10px] font-bold text-gray-500">EXECUTION SIGNAL</span>
        <span className="text-xs font-black text-white bg-binance-border px-3 py-1 rounded tracking-tighter">
          {action}
        </span>
      </div>
    </div>
  );
}