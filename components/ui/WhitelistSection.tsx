import { Plus, X } from 'lucide-react';

export function WhitelistSection() {
  const accounts = ['@VitalikButerin', '@binance', '@WatcherGuru'];

  return (
    <div className="card-binance">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest">Source Whitelist</h3>
        <button className="flex items-center gap-1 text-[10px] font-black text-binance-yellow border border-binance-yellow/20 px-2 py-1 rounded">
          <Plus size={12} /> ADD SOURCE
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {accounts.map((handle) => (
          <div key={handle} className="flex justify-between items-center p-3 bg-binance-black rounded border border-binance-border group">
            <span className="text-sm font-medium">{handle}</span>
            <X size={14} className="text-gray-600 cursor-pointer hover:text-binance-red transition-colors opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-gray-500 italic">
        "Pro accounts can monitor up to 5 custom handles. Elite has no limits."
      </p>
    </div>
  );
}