import { Send } from "lucide-react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b border-crypto-border bg-crypto-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black italic text-white flex items-center gap-2">
            <span className="text-crypto-gold">BIT</span>TRADER
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/guidance" className="hover:text-crypto-gold transition">Guidance</Link>
            <Link href="/login" className="bg-crypto-gold text-black px-4 py-2 rounded font-bold hover:bg-[#fcd535]">Launch App</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}