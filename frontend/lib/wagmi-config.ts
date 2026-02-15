"use client";

import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet, sepolia } from "wagmi/chains";

// Local Anvil (default)
const anvil = {
  id: 31337,
  name: "Anvil",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
} as const;

// Monad Testnet
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { decimals: 18, name: "MON", symbol: "MON" },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "MonadScan", url: "https://testnet.monadscan.com" },
  },
} as const;

// Anvil 用短超时，避免未启动时页面一直加载
const anvilTransport = http("http://127.0.0.1:8545", {
  timeout: 5_000,
  retryCount: 0,
});

export const config = createConfig({
  chains: [mainnet, sepolia, monadTestnet, anvil],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [monadTestnet.id]: http(),
    [anvil.id]: anvilTransport,
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
