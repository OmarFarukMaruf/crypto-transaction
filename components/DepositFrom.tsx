"use client";
import { useState } from 'react';
import { useDeposit } from '@/hooks/useDeposit';

export const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const { deposit, isPending, isConfirming, isSuccess, hash } = useDeposit();

  const TREASURY_ADDR = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Example

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm w-full max-w-md">
      <label className="block text-sm font-medium mb-2">Deposit ETH to Project</label>
      <input 
        type="number" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.01"
        className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      
      <button 
        onClick={() => deposit(amount, TREASURY_ADDR)}
        disabled={isPending || isConfirming || !amount}
        className="w-full py-3 bg-black text-white rounded-lg font-semibold disabled:bg-gray-400"
      >
        {isPending ? "Confirm in Wallet..." : isConfirming ? "Processing..." : "Deposit Now"}
      </button>

      {isSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded">
          Deposit Successful! <br/>
          <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" className="underline">View on Etherscan</a>
        </div>
      )}
    </div>
  );
};