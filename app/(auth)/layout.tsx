export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-crypto-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-crypto-card border border-crypto-border rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black italic text-white uppercase tracking-widest">BitTrader</h2>
          <p className="text-sm text-gray-500 mt-1">Authorized Access Only</p>
        </div>
        {children}
      </div>
    </div>
  );
}