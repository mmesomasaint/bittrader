import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-crypto" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-data" });

export const metadata = {
  title: "BitTrader | Crypto Trade Bot",
  description: "Predator-Class Trading Infrastructure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-crypto-bg text-gray-200 antialiased font-crypto">
        {children}
      </body>
    </html>
  );
}//