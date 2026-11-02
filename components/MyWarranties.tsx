"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  WARRANTY_GO_ABI,
  DEFAULT_CONTRACT_ADDRESS,
  WarrantyRecord,
  WarrantyStatus,
  formatDate,
  calculateRemainingDays,
  getStatusBadgeProps,
} from "@/lib/contract";
import {
  Package,
  Calendar,
  AlertOctagon,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

export function MyWarranties() {
  const { address, isConnected } = useAccount();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<bigint | null>(null);

  const {
    data: warrantiesData,
    isLoading,
    refetch,
    isRefetching,
  } = useReadContract({
    address: DEFAULT_CONTRACT_ADDRESS,
    abi: WARRANTY_GO_ABI,
    functionName: "getMyWarranties",
    account: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const {
    data: cancelHash,
    writeContract: writeCancel,
    isPending: isSubmittingCancel,
    error: cancelError,
  } = useWriteContract();

  const { isLoading: isWaitingCancel, isSuccess: isCancelSuccess } =
    useWaitForTransactionReceipt({
      hash: cancelHash,
    });

  // When cancellation confirms, refetch warranties list
  if (isCancelSuccess && cancellingId !== null) {
    refetch();
    setCancellingId(null);
  }

  const handleCopy = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(idText);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelWarranty = (id: bigint) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Warranty #${id.toString()}? Once cancelled, this warranty record cannot be reactivated.`
    );
    if (!confirmCancel) return;

    setCancellingId(id);
    writeCancel({
      address: DEFAULT_CONTRACT_ADDRESS,
      abi: WARRANTY_GO_ABI,
      functionName: "updateWarrantyStatus",
      args: [id, WarrantyStatus.Cancelled],
    });
  };

  if (!isConnected) {
    return null;
  }

  const rawList = (warrantiesData as unknown as WarrantyRecord[]) || [];
  // Reverse to show newest first
  const warranties = [...rawList].reverse();

  return (
    <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 sm:p-8 shadow-xl mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-charcoal-800/80 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5">
              <Package className="w-5 h-5 text-brand-purple-light" />
              <span>Seller Warranty Portfolio</span>
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple-light border border-purple-800/40">
              {warranties.length} Total
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Manage warranties registered under your connected seller account ({address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}).
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-charcoal-850 border border-charcoal-700 hover:bg-charcoal-750 transition self-start sm:self-center disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-brand-purple-light" : ""}`}
          />
          <span>{isRefetching ? "Refreshing..." : "Refresh List"}</span>
        </button>
      </div>

      {cancelError && (
        <div className="mb-5 p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{cancelError.message || "Failed to cancel warranty."}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Fetching your registered warranties from Botchain...</p>
        </div>
      ) : warranties.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 bg-charcoal-850/50 rounded-xl border border-charcoal-800/60 p-8">
          <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3 stroke-[1.5]" />
          <h4 className="text-base font-medium text-zinc-300">No Warranties Registered Yet</h4>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            When you register product warranties above, they will appear here with real-time status and lifecycle controls.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warranties.map((warranty) => {
            const remaining = calculateRemainingDays(warranty.expiryTimestamp);
            const badge = getStatusBadgeProps(warranty.status, remaining.isPast);
            const isCancelled = warranty.status === WarrantyStatus.Cancelled;
            const isProcessingThis = cancellingId === warranty.id && (isSubmittingCancel || isWaitingCancel);

            return (
              <div
                key={warranty.id.toString()}
                className="bg-charcoal-850/90 border border-charcoal-750 hover:border-charcoal-700 rounded-xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: ID and Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-zinc-400">
                        #{warranty.id.toString()}
                      </span>
                      <button
                        onClick={() => handleCopy(warranty.id.toString())}
                        title="Copy Warranty ID"
                        className="text-zinc-500 hover:text-zinc-200 transition"
                      >
                        {copiedId === warranty.id.toString() ? (
                          <Check className="w-3.5 h-3.5 text-brand-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="pt-3">
                    <h3 className="text-base font-semibold text-white tracking-tight line-clamp-1">
                      {warranty.productName}
                    </h3>
                    {warranty.productDescription && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {warranty.productDescription}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-charcoal-800/80 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Registered</span>
                      <span className="text-zinc-300 font-mono">
                        {formatDate(warranty.registrationTimestamp)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Expires</span>
                      <span className="text-zinc-300 font-mono">
                        {formatDate(warranty.expiryTimestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-charcoal-800 flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      remaining.isPast || isCancelled ? "text-zinc-500" : "text-brand-green"
                    }`}
                  >
                    {isCancelled ? "Voided on-chain" : remaining.label}
                  </span>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelWarranty(warranty.id)}
                      disabled={isProcessingThis}
                      className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 px-3 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      {isProcessingThis ? (
                        <>
                          <div className="w-3 h-3 border border-rose-400 border-t-transparent rounded-full animate-spin" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Cancel Warranty</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

