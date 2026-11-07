"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchain } from "@/lib/chains";
import { formatAddress } from "@/lib/contract";
import { ShieldCheck, Wallet, LogOut, AlertTriangle, ExternalLink } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchain.id;

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask") ||
      connectors.find((c) => c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="border-b border-charcoal-800/80 bg-charcoal-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center shadow-lg shadow-purple-900/20">
            <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-zinc-100">
                Warranty<span className="text-brand-purple-light">Go</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-charcoal-800 text-brand-green border border-brand-green/30 inline-flex items-center space-x-1">
                <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-sm object-contain" />
                <span>BOT Chain 677</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-normal">
              Your warranty, always within reach.
            </p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {isConnected && isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchain.id })}
              disabled={isSwitching}
              className="flex items-center space-x-2 text-xs font-medium px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain Mainnet"}</span>
            </button>
          )}

          {isConnected ? (
            <div className="flex items-center space-x-2 bg-charcoal-850 border border-charcoal-700/70 rounded-xl p-1.5 pl-3">
              <div className="flex items-center space-x-2 mr-2">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <button
                  onClick={copyAddress}
                  title="Click to copy address"
                  className="text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                >
                  {copied ? "Copied!" : formatAddress(address)}
                </button>
              </div>

              <a
                href={`https://scan.botchain.ai/address/${address}`}
                target="_blank"
                rel="noreferrer"
                title="View on BotScan Explorer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-charcoal-750 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => disconnect()}
                title="Disconnect Wallet"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 bg-brand-purple hover:bg-brand-purple-muted text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-purple-950/40 hover:shadow-purple-900/30 transition-all transform active:scale-95 disabled:opacity-60"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

