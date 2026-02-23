/*
  wagmi config — defines which chains and wallets to support.

  We configure connectors MANUALLY here instead of using getDefaultConfig(),
  because getDefaultConfig() auto-adds the "Family" wallet (family.co, the
  company that makes ConnectKit) which we don't want.

  Available connectors from wagmi:
  ┌─────────────────┬──────────────────────────────────────────────────────┐
  │ injected()      │ Any browser extension wallet (MetaMask, Rabby, Brave) │
  │ coinbaseWallet()│ Coinbase Wallet (browser ext + mobile app)            │
  │ walletConnect() │ WalletConnect — enables 300+ wallets via QR/deeplink  │
  └─────────────────┴──────────────────────────────────────────────────────┘

  WalletConnect supports: Trust Wallet, Rainbow, Uniswap, Argent, Ledger Live,
  Safe, OKX Wallet, Phantom, Zerion, 1inch, and 300+ more.
*/

import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";

// Get your free project ID at: https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  // ─── Which blockchains to support ─────────────────────────────────────────
  chains: [mainnet, polygon, base, sepolia],

  // ─── Which wallets to show in the modal ───────────────────────────────────
  connectors: [
    // 1. injected() — detects any browser wallet extension automatically.
    //    Shows as "MetaMask" if MetaMask is installed, "Rabby" if Rabby, etc.
    injected({ target: "metaMask" }),  // force MetaMask specifically
    injected(),                         // catch-all for other injected wallets

    // 2. Coinbase Wallet — works in browser + Coinbase mobile app
    coinbaseWallet({ appName: "Wallet Demo" }),

    // 3. WalletConnect — the big one: 300+ wallets via QR code or deeplink.
    //    This is how you get Trust, Rainbow, Ledger, Safe, OKX, etc.
    walletConnect({ projectId, showQrModal: true }),
  ],

  // ─── How to read blockchain data (http = public RPC endpoint) ─────────────
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
});