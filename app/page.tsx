"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { WarrantyLookup } from "@/components/WarrantyLookup";
import { WarrantyRegistration } from "@/components/WarrantyRegistration";
import { MyWarranties } from "@/components/MyWarranties";
import { ShieldCheck, Search, PlusCircle, ExternalLink, Cpu, Sparkles } from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"lookup" | "register">("lookup");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWarrantyRegistered = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-zinc-100 selection:bg-purple-900/50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-800 text-xs text-zinc-400 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span>Botchain Testnet (Chain ID: 968)</span>
            <span className="text-zinc-600">•</span>
            <span className="text-brand-purple-light font-medium">Smart Contract v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Decentralized Warranty Records.{" "}
            <span className="bg-gradient-to-r from-brand-purple-light to-brand-green bg-clip-text text-transparent">
              Zero Tampering.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A simple, transparent Web3 warranty management protocol for electronics retailers,
            phone vendors, and customers. Immutable proof of purchase and warranty coverage on-chain.
          </p>
        </div>

        {/* Tab Selection Switcher (Mobile & Fast Navigation) */}
        <div className="flex justify-center mb-8">
          <div className="bg-charcoal-900 border border-charcoal-800 p-1 rounded-xl inline-flex shadow-inner">
            <button
              onClick={() => setActiveTab("lookup")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "lookup"
                  ? "bg-charcoal-800 text-white shadow-sm border border-charcoal-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Search className="w-4 h-4 text-brand-purple-light" />
              <span>Verify / Lookup</span>
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "register"
                  ? "bg-charcoal-800 text-white shadow-sm border border-charcoal-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-green" />
              <span>Register Product</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Views */}
        <div className="space-y-8">
          {activeTab === "lookup" ? (
            <div className="max-w-4xl mx-auto">
              <WarrantyLookup />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <WarrantyRegistration onSuccessRegistered={handleWarrantyRegistered} />
            </div>
          )}

          {/* Seller Portfolio (Visible to connected seller) */}
          {isConnected && (
            <div className="max-w-5xl mx-auto" key={refreshTrigger}>
              <MyWarranties />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/80 bg-charcoal-900/60 py-8 mt-16 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-purple-light" />
            <span className="font-medium text-zinc-400">WarrantyGo Protocol</span>
            <span>—</span>
            <span>Live on Botchain Testnet</span>
          </div>

          <div className="flex items-center space-x-6 text-zinc-400">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center space-x-1"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center space-x-1"
            >
              <span>RPC Node</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

