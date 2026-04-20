export function ProfitStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard label="Total Realized PnL" value="+$4,230.15" sub="+12.4%" color="text-binance-green" />
      <StatCard label="Unrealized PnL" value="-$120.40" sub="-0.8%" color="text-binance-red" />
      <StatCard label="Total Equity" value="$24,500.00" sub="Across 2 Wallets" color="text-white" />
      <StatCard label="24h Change" value="+$450.20" sub="+2.1%" color="text-binance-green" />
    </div>
  );
}

function StatCard({ label, value, sub, color }: any) {
  return (
    <div className="card-binance">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <h2 className={`text-2xl font-black ${color}`}>{value}</h2>
        <span className={`text-xs font-bold ${color}`}>{sub}</span>
      </div>
    </div>
  );
}