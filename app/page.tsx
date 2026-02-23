"use client";

/*
  The page — reading data and writing transactions.

  - useSendTransaction: Wagmi hook to propose a transaction to the user's wallet.
  - useWaitForTransactionReceipt: Wait for the network to confirm the transaction.
  - viem parseEther: Utility to convert standard ETH (e.g. "0.1") to WEI (100000000000000000).
*/

import { useState } from "react";
import { useAccount, useBalance, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { formatUnits, parseEther } from "viem";

// A mock treasury address to simulate a "Deposit" to the app.
const TREASURY_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export default function Home() {
  // Wallet state
  const { isConnected, address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { chains, switchChain } = useSwitchChain();

  // 1. Transaction hooks
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  // 2. Wait for confirmation hook (reads the hash from the hook above)
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Local React state for form inputs
  const [depositAmount, setDepositAmount] = useState("");
  const [sendToAddress, setSendToAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  // Handler for the "Deposit" action
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;

    // sendTransaction asks the wallet to sign and broadcast the tx
    sendTransaction({
      to: TREASURY_ADDRESS,
      value: parseEther(depositAmount), // Convert "0.01" to Wei
    });
  };

  // Handler for the "Send to Address" action
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendToAddress || !sendAmount) return;

    sendTransaction({
      to: sendToAddress as `0x${string}`, // Typecast to satisfy TypeScript
      value: parseEther(sendAmount),
    });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "60px 20px",
        gap: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Wallet & Transactions Demo
      </h1>

      <ConnectKitButton />

      {isConnected && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "420px" }}>

          {/* --- WALLET INFO PANEL --- */}
          <div
            style={{
              padding: "20px 24px",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "4px" }}>
              ✅ Wallet Connected
            </p>

            <div>
              <span style={{ color: "#888", fontSize: "12px" }}>Current Network</span>
              <p style={{ fontFamily: "monospace", fontSize: "14px" }}>{chain?.name || "Unknown"}</p>
            </div>

            <div>
              <span style={{ color: "#888", fontSize: "12px" }}>Balance</span>
              <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#60a5fa" }}>
                {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : "Loading…"}
              </p>
            </div>

            {/* Network Switcher (useful for changing to Sepolia) */}
            <div style={{ marginTop: "8px" }}>
              <span style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>
                Switch Network
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {chains.map((c) => (
                  <button
                    key={c.id}
                    disabled={chain?.id === c.id}
                    onClick={() => switchChain?.({ chainId: c.id })}
                    style={{
                      padding: "4px 10px",
                      background: chain?.id === c.id ? "#3a3a3a" : "#222",
                      border: "1px solid #444",
                      color: chain?.id === c.id ? "#fff" : "#aaa",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: chain?.id === c.id ? "default" : "pointer",
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- TRANSACTION STATUS MESSAGES --- */}
          {(isPending || isConfirming || isConfirmed || error) && (
            <div style={{ padding: "16px", borderRadius: "8px", background: "#222", border: "1px solid #444", fontSize: "14px" }}>
              {isPending && <p style={{ color: "#fbbf24" }}>⏳ Waiting for you to confirm in wallet...</p>}
              {isConfirming && <p style={{ color: "#60a5fa" }}>🔄 Transaction sent! Waiting for network confirmation...</p>}
              {isConfirmed && <p style={{ color: "#34d399" }}>✅ Transaction confirmed successfully!</p>}
              {error && (
                <p style={{ color: "#f87171" }}>
                  ❌ Error: {(error as Error).message.slice(0, 100)}...
                </p>
              )}
              {hash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#9ca3af", fontSize: "12px", textDecoration: "underline", display: "block", marginTop: "8px" }}
                >
                  View on Explorer
                </a>
              )}
            </div>
          )}

          {/* --- DEPOSIT OPTION --- */}
          <div style={{ padding: "20px 24px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>1. Deposit (Pay Later)</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Simulates depositing funds to an app's smart contract or treasury.
            </p>
            <form onSubmit={handleDeposit} style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                step="0.0001"
                placeholder="Amount in ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isPending || isConfirming}
                style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #555", background: "#222", color: "white" }}
              />
              <button
                type="submit"
                disabled={isPending || isConfirming || !depositAmount}
                style={{ padding: "10px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", opacity: (isPending || isConfirming || !depositAmount) ? 0.5 : 1 }}
              >
                Deposit
              </button>
            </form>
          </div>

          {/* --- SEND TO ADDRESS OPTION --- */}
          <div style={{ padding: "20px 24px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>2. Send to Address</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
              Transfer ETH directly to another wallet address.
            </p>
            <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Recipient Address (0x...)"
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                disabled={isPending || isConfirming}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #555", background: "#222", color: "white" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Amount in ETH"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  disabled={isPending || isConfirming}
                  style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #555", background: "#222", color: "white" }}
                />
                <button
                  type="submit"
                  disabled={isPending || isConfirming || !sendToAddress || !sendAmount}
                  style={{ padding: "10px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", opacity: (isPending || isConfirming || !sendToAddress || !sendAmount) ? 0.5 : 1 }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>

        </div>
      )}
    </main>
  );
}
