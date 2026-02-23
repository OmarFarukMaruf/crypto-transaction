"use client";
import { ConnectKitButton } from "connectkit";
import { Wallet } from "lucide-react";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => (
        <button
          onClick={show}
          className="btn-primary"
          style={{ padding: "13px 28px", fontSize: "16px", gap: "10px" }}
        >
          <Wallet size={18} />
          {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
};