"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TARGET_SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt", "xrpusdt"];

export function LiveTicker() {
  // Use the uppercase version for the state keys to match Binance's response
  const [prices, setPrices] = useState<Record<string, { price: string; change: string }>>({});

  useEffect(() => {
    const streamNames = TARGET_SYMBOLS.map((s) => `${s}@ticker`).join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Binance returns the symbol in uppercase (e.g., 'BTCUSDT')
      const symbol = data.s; 
      const lastPrice = parseFloat(data.c).toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
      const priceChange = parseFloat(data.P).toFixed(2);

      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          price: lastPrice,
          change: (parseFloat(priceChange) >= 0 ? "+" : "") + priceChange + "%",
        },
      }));
    };

    ws.onerror = (err) => {
      toast.error("WEBSOCKET_ERROR");
      console.error("WebSocket Error:", err);
    }

    return () => ws.close();
  }, []);

  return (
    <div className="bg-crypto-gold text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/10 select-none">
      <div className="inline-block animate-marquee">
        {[...Array(3)].map((_, groupIndex) => (
          <span key={groupIndex} className="inline-flex">
            {TARGET_SYMBOLS.map((s) => {
              const tickerKey = s.toUpperCase();
              const data = prices[tickerKey];
              
              // If data isn't here yet, show a dashes
              const displayPrice = data ? data.price : "---.--";
              const displayChange = data ? data.change : "0.00%";
              const isPositive = !displayChange.includes("-");

              return (
                <span key={`${groupIndex}-${s}`} className="mx-8 font-black text-[10px] uppercase tracking-tighter flex items-center gap-2">
                  <span className="opacity-50">{tickerKey.replace("USDT", "")}</span>
                  <span className="font-mono tabular-nums">{displayPrice}</span> 
                  <span className={isPositive ? "bg-black/10 px-1 rounded" : "text-red-900 bg-red-900/10 px-1 rounded"}>
                    {displayChange}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
