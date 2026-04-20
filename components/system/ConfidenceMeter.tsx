import { Info } from 'lucide-react';

export function ConfidenceMeter() {
  const confidenceValue = 82; // This would be fetched from your central engine

  return (
    <div className="card-binance">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Confidence</h4>
        <Info size={14} className="text-gray-600 cursor-help" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Gauge SVG */}
        <svg className="w-32 h-20">
          <path
            d="M 10 70 A 50 50 0 0 1 118 70"
            fill="none"
            stroke="#2B3139"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 10 70 A 50 50 0 0 1 118 70"
            fill="none"
            stroke="#FCD535"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="170"
            strokeDashoffset={170 - (170 * confidenceValue) / 100}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute top-8 text-center">
          <span className="text-3xl font-black text-white">{confidenceValue}%</span>
          <p className="text-[10px] font-bold text-binance-green uppercase tracking-tighter">Strong Bullish</p>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-4 leading-relaxed text-center italic">
        "Aggregated from 12 whitelisted sources and official news streams."
      </p>
    </div>
  );
}