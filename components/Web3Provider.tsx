"use client";

/*
  ✅ STEP 2: Web3Provider — wraps your app so wallet hooks work everywhere.

  Three providers stacked together:
  ┌──────────────────────┬─────────────────────────────────────────────────┐
  │ WagmiProvider        │ Provides blockchain connection + hooks          │
  │ QueryClientProvider  │ Required by wagmi for caching data              │
  │ ConnectKitProvider   │ Powers the wallet selection modal UI            │
  └──────────────────────┴─────────────────────────────────────────────────┘

  NOTE: We use our own wagmi config (utils/wagmi.ts) which has the connectors
  we want (MetaMask, Coinbase, WalletConnect). No Family wallet included.
*/

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { config } from "@/utils/wagmi";

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="dark"
          options={{
            // Hide the "?" help button in the modal
            hideQuestionMarkCTA: true,
            // Hide the "No wallet?" link at the bottom
            hideNoWalletCTA: false,
            // "link" mode shows WalletConnect as a "Scan with phone" option
            // "modal" mode shows it as a full modal — better for seeing all wallets
            walletConnectCTA: "link",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};