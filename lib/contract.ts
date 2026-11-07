import { Address } from "viem";

export const WARRANTY_GO_ABI = [
  {
    type: "function",
    name: "registerWarranty",
    inputs: [
      { name: "productName", type: "string", internalType: "string" },
      { name: "productDescription", type: "string", internalType: "string" },
      { name: "durationDays", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getWarranty",
    inputs: [{ name: "warrantyId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct WarrantyGo.Warranty",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "seller", type: "address", internalType: "address" },
          { name: "productName", type: "string", internalType: "string" },
          { name: "productDescription", type: "string", internalType: "string" },
          { name: "durationDays", type: "uint256", internalType: "uint256" },
          { name: "registrationTimestamp", type: "uint256", internalType: "uint256" },
          { name: "expiryTimestamp", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum WarrantyGo.Status" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMyWarranties",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct WarrantyGo.Warranty[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "seller", type: "address", internalType: "address" },
          { name: "productName", type: "string", internalType: "string" },
          { name: "productDescription", type: "string", internalType: "string" },
          { name: "durationDays", type: "uint256", internalType: "uint256" },
          { name: "registrationTimestamp", type: "uint256", internalType: "uint256" },
          { name: "expiryTimestamp", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum WarrantyGo.Status" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalWarranties",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateWarrantyStatus",
    inputs: [
      { name: "warrantyId", type: "uint256", internalType: "uint256" },
      { name: "newStatus", type: "uint8", internalType: "enum WarrantyGo.Status" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "WarrantyRegistered",
    inputs: [
      { name: "warrantyId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "seller", type: "address", indexed: true, internalType: "address" },
      { name: "productName", type: "string", indexed: false, internalType: "string" },
      { name: "durationDays", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "registrationTimestamp", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "expiryTimestamp", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WarrantyStatusUpdated",
    inputs: [
      { name: "warrantyId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "newStatus", type: "uint8", indexed: false, internalType: "enum WarrantyGo.Status" },
      { name: "updatedBy", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  { type: "error", name: "EmptyProductName", inputs: [] },
  { type: "error", name: "InvalidDuration", inputs: [] },
  { type: "error", name: "WarrantyNotFound", inputs: [{ name: "warrantyId", type: "uint256", internalType: "uint256" }] },
  {
    type: "error",
    name: "OnlySellerAllowed",
    inputs: [
      { name: "caller", type: "address", internalType: "address" },
      { name: "seller", type: "address", internalType: "address" },
    ],
  },
  { type: "error", name: "WarrantyAlreadyCancelled", inputs: [] },
  { type: "error", name: "CannotReactivateCancelledWarranty", inputs: [] },
  { type: "error", name: "InvalidStatusTransition", inputs: [] },
] as const;

export enum WarrantyStatus {
  Active = 0,
  Expired = 1,
  Cancelled = 2,
}

export interface WarrantyRecord {
  id: bigint;
  seller: `0x${string}`;
  productName: string;
  productDescription: string;
  durationDays: bigint;
  registrationTimestamp: bigint;
  expiryTimestamp: bigint;
  status: WarrantyStatus;
}

export const DEFAULT_CONTRACT_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_WARRANTY_CONTRACT_ADDRESS as Address) ||
  "0x11F0528d8E7dc0b094F01eC693a1F22CF296D56F";

export function formatAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestampBigInt: bigint): string {
  const timestamp = Number(timestampBigInt) * 1000;
  if (!timestamp || isNaN(timestamp)) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function calculateRemainingDays(expiryTimestampBigInt: bigint): {
  days: number;
  isPast: boolean;
  label: string;
} {
  const now = Math.floor(Date.now() / 1000);
  const expiry = Number(expiryTimestampBigInt);
  const diffSeconds = expiry - now;

  if (diffSeconds <= 0) {
    const daysAgo = Math.floor(Math.abs(diffSeconds) / 86400);
    return {
      days: daysAgo,
      isPast: true,
      label: daysAgo === 0 ? "Expired today" : `Expired ${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`,
    };
  }

  const daysLeft = Math.ceil(diffSeconds / 86400);
  return {
    days: daysLeft,
    isPast: false,
    label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} remaining`,
  };
}

export function getStatusBadgeProps(status: WarrantyStatus, isPast: boolean) {
  // If explicitly cancelled, status is Cancelled
  if (status === WarrantyStatus.Cancelled) {
    return {
      label: "Cancelled",
      badgeClass: "bg-zinc-800 text-zinc-400 border border-zinc-700/60",
      dotClass: "bg-zinc-500",
    };
  }
  // If expired by time or status enum
  if (status === WarrantyStatus.Expired || isPast) {
    return {
      label: "Expired",
      badgeClass: "bg-rose-950/40 text-rose-300 border border-rose-800/50",
      dotClass: "bg-rose-500",
    };
  }
  // Otherwise active
  return {
    label: "Active",
    badgeClass: "bg-emerald-950/40 text-emerald-300 border border-emerald-800/50",
    dotClass: "bg-emerald-400",
  };
}

