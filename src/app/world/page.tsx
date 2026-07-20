"use client";
import { useEffect, useState } from "react";
import PortfolioWorld from "@/components/PortfolioWorld";
import Link from "next/link";

const CONTENT: Record<string, { title: string, body: string }> = {
  about: { title: "About Me", body: "Manu — solo dev & founder, Axelo Technologies..." },
  projects: { title: "Projects", body: "driftlock, Axelo Safari Suite, Eastern Vacations..." },
  skills: { title: "Skills", body: "Next.js, Supabase, M-Pesa/Stripe, Claude API..." },
  contact: { title: "Contact", body: "DMs open on X, or email..." },
};

export default function WorldPage() {
  const [active, setActive] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: any) => {
      const stationKey = e.detail;
      setActive(stationKey);
      setVisited((v) => new Set(v).add(stationKey));
    };
    window.addEventListener("station-enter", handler);
    return () => window.removeEventListener("station-enter", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1310] flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute -top-10 left-0">
            <Link href="/" className="text-gray-400 hover:text-white mb-4 block">← Back to Terminal</Link>
        </div>

        <PortfolioWorld />

        {/* quest log */}
        <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded text-sm w-48 border border-gray-700 shadow-lg pointer-events-none">
          <div className="font-bold mb-2 text-[#4AF0A0]">Quest Log</div>
          {Object.keys(CONTENT).map((k) => (
            <div key={k} className={`flex items-center gap-2 mb-1 ${visited.has(k) ? "text-gray-500" : "text-gray-200"}`}>
                <div className={`w-3 h-3 rounded-full border ${visited.has(k) ? "bg-[#4AF0A0] border-[#4AF0A0]" : "border-gray-500"}`}></div>
                <span className={visited.has(k) ? "line-through" : ""}>Visit {CONTENT[k].title}</span>
            </div>
          ))}
        </div>

        {/* content popup */}
        {active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="bg-[#0F1310] border-2 border-[#4AF0A0] p-6 rounded-lg max-w-md w-full text-white shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold mb-4 text-[#4AF0A0]">{CONTENT[active].title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">{CONTENT[active].body}</p>
              <button 
                onClick={() => setActive(null)} 
                className="w-full px-4 py-2 bg-[#4AF0A0] text-black font-semibold rounded hover:bg-[#3be090] transition-colors"
              >
                Close & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
