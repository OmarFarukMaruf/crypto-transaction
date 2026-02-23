import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export const useDeposit = () => {
    const {
        data: hash,
        isPending,
        sendTransaction
    } = useSendTransaction();

    const {
        isLoading: isConfirming,
        isSuccess
    } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = (amount: string, toAddress: string) => {
        if (!amount || !toAddress) return;

        sendTransaction({
            to: toAddress as `0x${string}`,
            value: parseEther(amount),
        });
    };

    return {
        deposit,
        isPending,
        isConfirming,
        isSuccess,
        hash,
    };
};
