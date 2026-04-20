export function StatusHeader() {
  return (
    <header className="h-16 border-b border-binance-border bg-binance-black/50 backdrop-blur-sm flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-binance-green rounded-full animate-pulse shadow-[0_0_8px_#0ecb81]" />
          <span className="text-xs font-bold text-binance-green uppercase tracking-widest">Engine Online</span>
        </div>
        <div className="h-4 w-[1px] bg-binance-border" />
        <div className="text-xs text-gray-500">
          Latency: <span className="text-white font-mono">14ms</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-binance-gray border border-binance-border px-3 py-1 rounded text-[10px] font-bold">
          PRO TIER
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-binance-yellow to-orange-500" />
      </div>
    </header>
  );
}