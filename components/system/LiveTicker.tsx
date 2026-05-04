"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Bybit uses uppercase while binance uses lowercase
const TARGET_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];

export default function LiveTicker() {
  // Use the uppercase version for the state keys to match Bybit's response
  const [prices, setPrices] = useState<Record<string, { price: string; change: string }>>({});

  useEffect(() => {
    // Bybit V5 Public Stream
    const ws = new WebSocket("wss://stream.bytick.com/v5/public/linear");

    ws.onopen = () => {
      // Subscribing to multiple tickers in one command
      const subscribeMsg = {
        op: "subscribe",
        args: TARGET_SYMBOLS.map(s => `tickers.${s}`)
      };
      ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      
      // Bybit pushes 'snapshot' or 'delta' updates
      if (response.topic && response.topic.startsWith("tickers")) {
        const data = response.data;
        const symbol = data.symbol;
        
        const lastPrice = parseFloat(data.lastPrice).toLocaleString(undefined, { 
          minimumFractionDigits: 2 
        });
        const priceChange = parseFloat(data.price24hPcnt * 100).toFixed(2);

        setPrices((prev) => ({
          ...prev,
          [symbol]: {
            price: lastPrice,
            change: (parseFloat(priceChange) >= 0 ? "+" : "") + priceChange + "%",
          },
        }));
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket error: ", error);
      toast.error("ERROR_FETCHING_TICKERS");
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
