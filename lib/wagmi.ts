import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { createPublicClient } from "viem";
import { botchain, botchainTestnet } from "./chains";

export const config = createConfig({
  chains: [botchain, botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchain.id]: http(botchain.rpcUrls.default.http[0]),
    [botchainTestnet.id]: http(botchainTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
});

// Dedicated standalone public client for looking up warranties even when no wallet is connected
export const publicClient = createPublicClient({
  chain: botchain,
  transport: http(botchain.rpcUrls.default.http[0]),
});
