import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "Wallet Connection Demo",
  description: "Learn how to connect a crypto wallet with wagmi + ConnectKit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/*
          ✅ STEP 1: Wrap your app in Web3Provider.
          This sets up wagmi + ConnectKit so any component
          inside can access wallet state.
        */}
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
