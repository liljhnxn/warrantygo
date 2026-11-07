"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { WarrantyLookup } from "@/components/WarrantyLookup";
import { WarrantyRegistration } from "@/components/WarrantyRegistration";
import { MyWarranties } from "@/components/MyWarranties";
import {
  ShieldCheck,
  Search,
  PlusCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"lookup" | "register">("lookup");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [copiedContract, setCopiedContract] = useState(false);

  const MAINNET_CONTRACT = "0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F";

  const handleCopyContract = () => {
    navigator.clipboard.writeText(MAINNET_CONTRACT);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleWarrantyRegistered = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-zinc-100 selection:bg-purple-900/50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-charcoal-900 border border-charcoal-800 text-xs text-zinc-300 mb-4 shadow-sm">
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              className="w-4 h-4 rounded-sm object-contain"
            />
            <span className="text-brand-green font-medium">BOT Chain Mainnet (Chain ID: 677)</span>
            <span className="text-zinc-600">•</span>
            <span className="text-brand-purple-light font-medium">Smart Contract v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Decentralized Warranty Records.{" "}
            <span className="bg-gradient-to-r from-brand-purple-light to-brand-green bg-clip-text text-transparent">
              Zero Tampering.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-4">
            A simple, transparent Web3 warranty management protocol for electronics retailers,
            phone vendors, and customers. Immutable proof of purchase and warranty coverage on BOT Chain.
          </p>

          {/* Verified Mainnet Contract Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-800/90 text-xs">
            <span className="text-zinc-500">Mainnet Contract:</span>
            <a
              href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT}#code`}
              target="_blank"
              rel="noreferrer"
              title="View verified contract on BotScan"
              className="font-mono text-brand-green hover:underline flex items-center space-x-1"
            >
              <span>{MAINNET_CONTRACT}</span>
              <ExternalLink className="w-3 h-3 text-brand-green/80" />
            </a>
            <button
              onClick={handleCopyContract}
              title="Copy Mainnet Contract Address"
              className="text-zinc-400 hover:text-white p-1 transition"
            >
              {copiedContract ? (
                <Check className="w-3.5 h-3.5 text-brand-green" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Selection Switcher */}
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

        {/* BOT Chain Ecosystem Card Section */}
        <div className="max-w-4xl mx-auto mt-14 bg-charcoal-900/80 border border-charcoal-800 rounded-2xl p-6 sm:p-7 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-charcoal-950 border border-charcoal-800 p-1.5 flex items-center justify-center shadow-md">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full rounded-lg object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>BOT Chain Ecosystem</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-charcoal-800 text-brand-green border border-brand-green/30">
                    Chain ID 677
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  WarrantyGo smart contracts and verification queries run directly on BOT Chain infrastructure.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-xs font-medium text-zinc-200 hover:text-white transition shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-xs font-medium text-zinc-200 hover:text-white transition shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/80 bg-charcoal-900/60 py-8 mt-16 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-purple-light" />
            <span className="font-semibold text-white">WarrantyGo Protocol</span>
            <span>•</span>
            <span className="text-zinc-400">Built on BOT Chain</span>
            <a
              href={`https://scan.botchain.ai/address/${MAINNET_CONTRACT}#code`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-mono text-brand-green hover:underline ml-1"
            >
              (0x11F0...D56F)
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-300">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center space-x-1.5"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
              />
              <span>BOT Chain Website: https://botchain.ai</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center space-x-1.5"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
              />
              <span>BOT Chain Explorer: https://scan.botchain.ai</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
