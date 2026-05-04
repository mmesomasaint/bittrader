"use client";
import { useEffect, useState } from "react";

const TARGET_SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt", "xrpusdt"];

export function LiveTicker() {
  const [prices, setPrices] = useState<Record<string, { price: string; change: string }>>({});

  useEffect(() => {
    // Connect to Binance WebSocket (Combined Stream)
    const streamNames = TARGET_SYMBOLS.map((s) => `${s}@ticker`).join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s; // e.g., BTCUSDT
      const lastPrice = parseFloat(data.c).toLocaleString(undefined, { minimumFractionDigits: 2 });
      const priceChange = parseFloat(data.P).toFixed(2);

      setPrices((prev) => ({
        ...prev,
        [symbol]: {
          price: lastPrice,
          change: (parseFloat(priceChange) >= 0 ? "+" : "") + priceChange + "%",
        },
      }));
    };

    return () => ws.close(); // Clean up on unmount
  }, []);

  return (
    <div className="bg-crypto-gold text-black py-2 overflow-hidden whitespace-nowrap border-y border-black/10">
      <div className="inline-block animate-marquee">
        {/* We repeat the array to ensure the marquee loop is seamless */}
        {[...Array(3)].map((_, groupIndex) => (
          <span key={groupIndex}>
            {TARGET_SYMBOLS.map((s) => {
              const ticker = s.toUpperCase();
              const data = prices[ticker] || { price: "LOADING...", change: "0.00%" };
              const isPositive = !data.change.includes("-");

              return (
                <span key={s} className="mx-8 font-black text-[10px] uppercase tracking-tighter">
                  {ticker.replace("USDT", "/USDT")} 
                  <span className="mx-2 font-mono tabular-nums">{data.price}</span> 
                  <span className={isPositive ? "text-black" : "text-red-800"}>
                    ({data.change})
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
