import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { createPublicClient } from "viem";
import { botchainTestnet } from "./chains";

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http(botchainTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
});

// Dedicated standalone public client for looking up warranties even when no wallet is connected
export const publicClient = createPublicClient({
  chain: botchainTestnet,
  transport: http(botchainTestnet.rpcUrls.default.http[0]),
});

