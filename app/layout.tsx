import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-crypto" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-data" });

export const metadata = {
  title: "BitTrader | Crypto Trade Bot",
  description: "Predator-Class Trading Infrastructure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader 
          color="#F0B90B" // Crypto Gold
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #F0B90B,0 0 5px #F0B90B"
        />
        {children}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#0A0A0A',
              border: '1px solid #1F1F1F',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
            },
          }} 
        />
      </body>
    </html>
  );
}//