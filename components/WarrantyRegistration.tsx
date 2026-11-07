"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEventLogs } from "viem";
import {
  WARRANTY_GO_ABI,
  DEFAULT_CONTRACT_ADDRESS,
  formatDate,
} from "@/lib/contract";
import {
  PlusCircle,
  Clock,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Lock,
  ArrowRight,
} from "lucide-react";

interface WarrantyRegistrationProps {
  onSuccessRegistered?: () => void;
}

export function WarrantyRegistration({ onSuccessRegistered }: WarrantyRegistrationProps) {
  const { isConnected } = useAccount();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [durationDays, setDurationDays] = useState<number>(365);
  const [customDays, setCustomDays] = useState<string>("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // Success State details
  const [registeredResult, setRegisteredResult] = useState<{
    id: string;
    productName: string;
    expiryDate: string;
    txHash: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState(false);

  const {
    data: hash,
    writeContract,
    isPending: isSubmitting,
    error: submitError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const durationPresets = [
    { label: "30 Days (1 Mo)", days: 30 },
    { label: "90 Days (3 Mo)", days: 90 },
    { label: "180 Days (6 Mo)", days: 180 },
    { label: "365 Days (1 Yr)", days: 365 },
  ];

  const handleSelectPreset = (days: number) => {
    setIsCustomDuration(false);
    setDurationDays(days);
  };

  const handleCustomDurationChange = (val: string) => {
    setCustomDays(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDurationDays(parsed);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || durationDays <= 0) return;

    writeContract(
      {
        address: DEFAULT_CONTRACT_ADDRESS,
        abi: WARRANTY_GO_ABI,
        functionName: "registerWarranty",
        args: [productName.trim(), productDescription.trim(), BigInt(durationDays)],
      },
      {
        onSuccess: (txHash) => {
          // Pre-calculate approximate expiry based on selected days
          const expiryTimestamp = BigInt(
            Math.floor(Date.now() / 1000) + durationDays * 86400
          );
          setRegisteredResult({
            id: "Pending Confirmation...",
            productName: productName.trim(),
            expiryDate: formatDate(expiryTimestamp),
            txHash,
          });

          // Wait a tick or trigger callback
          if (onSuccessRegistered) {
            onSuccessRegistered();
          }
        },
      }
    );
  };

  const handleCopyId = () => {
    if (!registeredResult?.id) return;
    navigator.clipboard.writeText(registeredResult.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetForm = () => {
    setProductName("");
    setProductDescription("");
    setDurationDays(365);
    setIsCustomDuration(false);
    setCustomDays("");
    setRegisteredResult(null);
    resetWrite();
  };

  if (!isConnected) {
    return (
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-charcoal-850 border border-charcoal-700/80 flex items-center justify-center mb-4 text-zinc-400">
          <Lock className="w-6 h-6 text-brand-purple-light" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-200">
          Seller Portal Access Required
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mt-1 mb-5">
          Connect your authorized seller wallet to register on-chain warranties for products and issue tamper-proof digital certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 sm:p-8 shadow-xl relative">
      <div className="pb-6 mb-6 border-b border-charcoal-800/80">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5">
          <PlusCircle className="w-5 h-5 text-brand-green" />
          <span>Register New Warranty</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Issue an immutable on-chain warranty certificate stored permanently on Botchain Testnet.
        </p>
      </div>

      {registeredResult && (isConfirmed || hash) ? (
        <div className="bg-charcoal-850 border border-brand-green/30 rounded-xl p-6 space-y-5">
          <div className="flex items-center space-x-3 text-brand-green">
            <CheckCircle className="w-6 h-6 stroke-[2.2]" />
            <h3 className="text-lg font-semibold text-white">
              Warranty Successfully Submitted!
            </h3>
          </div>

          <p className="text-sm text-zinc-300">
            Warranty certificate for{" "}
            <span className="font-semibold text-white">
              {registeredResult.productName}
            </span>{" "}
            is registered on Botchain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="bg-charcoal-900/80 p-4 rounded-xl border border-charcoal-750">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Warranty Valid Until</span>
              </div>
              <p className="text-sm font-medium text-zinc-200">
                {registeredResult.expiryDate}
              </p>
            </div>

            {/* Transaction Hash */}
            <div className="bg-charcoal-900/80 p-4 rounded-xl border border-charcoal-750">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <ExternalLink className="w-4 h-4 text-brand-purple-light" />
                <span>BotScan Explorer</span>
              </div>
              <a
                href={`https://scan.botchain.ai/tx/${registeredResult.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-brand-purple-light hover:underline flex items-center space-x-1.5 truncate"
              >
                <span>View Transaction</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleResetForm}
              className="flex-1 py-3 px-4 rounded-xl bg-charcoal-750 hover:bg-charcoal-700 text-sm font-medium text-zinc-200 transition"
            >
              Register Another Product
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-2">
              Product Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full bg-charcoal-850 border border-charcoal-700/80 focus:border-brand-purple text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-2">
              Product Description & Serial Notes
            </label>
            <textarea
              rows={3}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="e.g. Serial: SN-829103, Color: Midnight Silver. Covers manufacturer defects, battery, and electronic components."
              className="w-full bg-charcoal-850 border border-charcoal-700/80 focus:border-brand-purple text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Warranty Duration */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-2">
              Warranty Duration <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {durationPresets.map((preset) => {
                const isSelected = !isCustomDuration && durationDays === preset.days;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handleSelectPreset(preset.days)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                      isSelected
                        ? "bg-brand-purple/20 border-brand-purple text-purple-200 shadow-sm shadow-purple-900/30"
                        : "bg-charcoal-850 border-charcoal-700/70 text-zinc-400 hover:border-charcoal-600 hover:text-zinc-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Duration Toggle */}
            <div className="flex items-center space-x-3 text-xs">
              <button
                type="button"
                onClick={() => setIsCustomDuration(!isCustomDuration)}
                className="text-zinc-400 hover:text-brand-purple-light transition flex items-center space-x-1"
              >
                <span>{isCustomDuration ? "Use standard presets" : "Or enter custom days"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {isCustomDuration && (
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={customDays}
                  onChange={(e) => handleCustomDurationChange(e.target.value)}
                  placeholder="Enter number of days"
                  className="w-48 bg-charcoal-850 border border-charcoal-700/80 focus:border-brand-purple text-zinc-100 placeholder-zinc-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                />
                <span className="text-xs text-zinc-400">days</span>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs">
              {submitError.message || "Failed to submit transaction. Please check your wallet."}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isConfirming || !productName.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-purple-950/40 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting || isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>
                  {isSubmitting ? "Confirming in Wallet..." : "Broadcasting to Botchain..."}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Register Warranty ({durationDays} Days)</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

