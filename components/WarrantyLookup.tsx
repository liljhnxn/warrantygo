"use client";

import { useState } from "react";
import { publicClient } from "@/lib/wagmi";
import {
  WARRANTY_GO_ABI,
  DEFAULT_CONTRACT_ADDRESS,
  WarrantyRecord,
  formatAddress,
  formatDate,
  calculateRemainingDays,
  getStatusBadgeProps,
} from "@/lib/contract";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  Shield,
  FileText,
} from "lucide-react";

export function WarrantyLookup() {
  const [warrantyIdInput, setWarrantyIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warrantyData, setWarrantyData] = useState<WarrantyRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = warrantyIdInput.trim();

    if (!cleanId || isNaN(Number(cleanId)) || Number(cleanId) <= 0) {
      setError("Please enter a valid numeric Warranty ID (e.g. 1001).");
      setWarrantyData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await publicClient.readContract({
        address: DEFAULT_CONTRACT_ADDRESS,
        abi: WARRANTY_GO_ABI,
        functionName: "getWarranty",
        args: [BigInt(cleanId)],
      });

      const warranty = result as unknown as {
        id: bigint;
        seller: `0x${string}`;
        productName: string;
        productDescription: string;
        durationDays: bigint;
        registrationTimestamp: bigint;
        expiryTimestamp: bigint;
        status: number;
      };

      setWarrantyData({
        id: warranty.id,
        seller: warranty.seller,
        productName: warranty.productName,
        productDescription: warranty.productDescription,
        durationDays: warranty.durationDays,
        registrationTimestamp: warranty.registrationTimestamp,
        expiryTimestamp: warranty.expiryTimestamp,
        status: Number(warranty.status),
      });
    } catch (err: any) {
      console.error("Lookup error:", err);
      if (
        err?.message?.includes("WarrantyNotFound") ||
        err?.shortMessage?.includes("WarrantyNotFound") ||
        err?.details?.includes("WarrantyNotFound")
      ) {
        setError(`Warranty #${cleanId} was not found on Botchain. Please check the ID.`);
      } else {
        setError("Unable to find or verify this warranty record. Please ensure the ID is correct.");
      }
      setWarrantyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingInfo = warrantyData
    ? calculateRemainingDays(warrantyData.expiryTimestamp)
    : null;

  const statusBadge = warrantyData && remainingInfo
    ? getStatusBadgeProps(warrantyData.status, remainingInfo.isPast)
    : null;

  return (
    <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-charcoal-800/80 gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Search className="w-5 h-5 text-brand-purple-light" />
            <span>Public Warranty Verification</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Check any product’s authentic on-chain warranty status instantly. No wallet connection needed.
          </p>
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-charcoal-850 border border-charcoal-700/80 text-xs text-zinc-300 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-brand-green" />
          <span>Direct Node Query</span>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={warrantyIdInput}
            onChange={(e) => setWarrantyIdInput(e.target.value)}
            placeholder="Enter Warranty ID (e.g. 1001)"
            className="w-full bg-charcoal-850 border border-charcoal-700/80 focus:border-brand-purple text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-muted text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg shadow-purple-950/40 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{isLoading ? "Checking..." : "Check Warranty"}</span>
        </button>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Warranty Details Card */}
      {warrantyData && statusBadge && remainingInfo && (
        <div className="mt-6 bg-charcoal-850/90 border border-charcoal-700/80 rounded-xl p-5 sm:p-6 shadow-inner transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-charcoal-750 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Warranty #{warrantyData.id.toString()}
                </span>
                <button
                  onClick={() => handleCopy(warrantyData.id.toString(), "id")}
                  title="Copy Warranty ID"
                  className="text-zinc-500 hover:text-zinc-200 transition"
                >
                  {copiedField === "id" ? (
                    <Check className="w-3.5 h-3.5 text-brand-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                {warrantyData.productName}
              </h3>
            </div>

            {/* Dynamic Status Badge */}
            <div
              className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center ${statusBadge.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
              <span>{statusBadge.label}</span>
            </div>
          </div>

          {/* Description */}
          {warrantyData.productDescription && (
            <div className="py-4 border-b border-charcoal-750 flex items-start space-x-3 text-sm text-zinc-300">
              <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="whitespace-pre-line leading-relaxed">
                {warrantyData.productDescription}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
            {/* Seller */}
            <div className="bg-charcoal-900/60 p-3.5 rounded-lg border border-charcoal-800">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <User className="w-3.5 h-3.5 text-brand-purple-light" />
                <span>Seller Address</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-zinc-200">
                  {formatAddress(warrantyData.seller)}
                </span>
                <button
                  onClick={() => handleCopy(warrantyData.seller, "seller")}
                  title="Copy Seller Address"
                  className="p-1 text-zinc-500 hover:text-zinc-200 transition"
                >
                  {copiedField === "seller" ? (
                    <Check className="w-3.5 h-3.5 text-brand-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Registration Date */}
            <div className="bg-charcoal-900/60 p-3.5 rounded-lg border border-charcoal-800">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Registration Date</span>
              </div>
              <span className="text-sm text-zinc-200 block truncate">
                {formatDate(warrantyData.registrationTimestamp)}
              </span>
            </div>

            {/* Expiry Date */}
            <div className="bg-charcoal-900/60 p-3.5 rounded-lg border border-charcoal-800">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Expiry Date</span>
              </div>
              <span className="text-sm text-zinc-200 block truncate">
                {formatDate(warrantyData.expiryTimestamp)}
              </span>
            </div>

            {/* Remaining Duration */}
            <div className="bg-charcoal-900/60 p-3.5 rounded-lg border border-charcoal-800">
              <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
                <Shield className="w-3.5 h-3.5 text-brand-green" />
                <span>Remaining Period</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  remainingInfo.isPast ? "text-rose-400" : "text-brand-green"
                }`}
              >
                {remainingInfo.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

