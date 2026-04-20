// app/(dashboard)/components/HandshakeModal.tsx
export default function HandshakeModal() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="card-binance max-w-md w-full border-binance-yellow/50">
        <h2 className="text-2xl font-bold text-binance-yellow mb-2">Wire Your Intel</h2>
        <p className="text-gray-400 text-sm mb-6">
          Connect your exchange and Telegram to activate your autonomous trading engine.
        </p>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Exchange</label>
            <select className="w-full bg-binance-black border border-binance-border p-3 rounded mt-1 focus:border-binance-yellow outline-none">
              <option>Bybit (Recommended)</option>
              <option>Binance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">API Key</label>
            <input type="text" className="w-full bg-binance-black border border-binance-border p-3 rounded mt-1 outline-none focus:border-binance-yellow" placeholder="paste_key_here" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Telegram Handle</label>
            <input type="text" className="w-full bg-binance-black border border-binance-border p-3 rounded mt-1 outline-none focus:border-binance-yellow" placeholder="@your_username" />
          </div>

          <button className="btn-binance w-full py-4 mt-4 shadow-[0_0_20px_rgba(252,213,53,0.2)]">
            Activate Infrastructure
          </button>
          
          <button className="w-full text-gray-500 text-xs hover:text-white transition mt-2">
            I'll do this later (Limited View)
          </button>
        </form>
      </div>
    </div>
  )
}