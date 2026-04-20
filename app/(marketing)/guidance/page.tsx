import { BookOpen, CheckCircle2, Terminal, ShieldAlert } from "lucide-react";

export default function GuidancePage() {
  const steps = [
    {
      title: "API Configuration",
      desc: "Generate a System-generated API Key on Bybit with 'Unified Trading' permissions.",
      icon: Terminal,
    },
    {
      title: "IP Whitelisting",
      desc: "You MUST whitelist the Optima Node IP in your Bybit settings to allow execution.",
      icon: ShieldAlert,
    },
    {
      title: "Telegram Handshake",
      desc: "Connect your Telegram via the Dashboard to receive sub-second trade heartbeats.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="mb-16">
        <h1 className="text-4xl font-black text-white mb-4 italic uppercase">System Guidance</h1>
        <p className="text-gray-400">Follow these protocols to calibrate your Black Marlin engine for 1.90ms execution.</p>
      </div>

      <div className="grid gap-12">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6 items-start group">
            <div className="bg-crypto-card border border-crypto-border p-4 rounded-xl group-hover:border-crypto-gold transition-colors">
              <step.icon className="text-crypto-gold" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">0{i + 1}. {step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-crypto-card border border-crypto-border rounded-2xl border-l-4 border-l-crypto-green">
        <h4 className="text-white font-bold mb-2">Pro-Architect Tip:</h4>
        <p className="text-sm text-gray-400">
          For maximum reliability, ensure your Bybit account has sufficient USDT in the <span className="text-white">Unified Trading Account (UTA)</span>. The Black Marlin engine will auto-detect available margin.
        </p>
      </div>
    </div>
  );
}