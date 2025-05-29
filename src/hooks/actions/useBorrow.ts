import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { tokenInput, tokenData } from "liquidops";
import { invalidateData } from "@/utils/caches/cacheUtils";
import { PendingTxContext } from "@/components/PendingTransactions/PendingTransactions";
import { useContext } from "react";
import { Quantity } from "ao-tokens";

interface BorrowParams {
  token: string;
  quantity: bigint;
}

type RepayParams = BorrowParams;

export function useBorrow() {
  const queryClient = useQueryClient();
  const [, setPendingTransactions] = useContext(PendingTxContext);

  const borrowMutation = useMutation({
    mutationFn: async ({ token, quantity }: BorrowParams) => {
      try {
        return await LiquidOpsClient.borrow({
          token,
          quantity,
          noResult: true
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (transferId, { token, quantity }) => {
      try {
        const ticker = token.toUpperCase();

        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(ticker);

        invalidateData([
          `user-balance-${tokenAddress}-${walletAddress}`,
          `user-position-${tokenAddress}-${walletAddress}`,
          `user-position-balance-${tokenAddress}-${walletAddress}`,
          `global-position-${walletAddress}`,
        ]);
        await queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance",
          ],
        });

        setPendingTransactions((pending) => [
          ...pending,
          {
            id: transferId,
            ticker: ticker,
            timestamp: Date.now(),
            qty: new Quantity(quantity, tokenData[ticker].denomination),
            action: "borrow",
          },
        ]);
      } catch {}
    },
  });

  const repayMutation = useMutation({
    mutationFn: async ({ token, quantity }: RepayParams) => {
      try {
        return await LiquidOpsClient.repay({
          token,
          quantity,
          noResult: true
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (transferId, { token, quantity }) => {
      try {
        const ticker = token.toUpperCase();

        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(ticker);

        invalidateData([
          `user-balance-${tokenAddress}-${walletAddress}`,
          `user-position-${tokenAddress}-${walletAddress}`,
          `user-position-balance-${tokenAddress}-${walletAddress}`,
          `global-position-${walletAddress}`,
        ]);
        await queryClient.refetchQueries({
          queryKey: [
            "global-position",
            "position",
            "position-balance",
            "user-balance",
          ],
        });

        setPendingTransactions((pending) => [
          ...pending,
          {
            id: transferId,
            ticker: ticker,
            timestamp: Date.now(),
            qty: new Quantity(quantity, tokenData[ticker].denomination),
            action: "borrow",
          },
        ]);
      } catch {}
    },
  });

  return {
    borrow: borrowMutation.mutate,
    isBorrowing: borrowMutation.isPending,
    borrowError: borrowMutation.error,

    repay: repayMutation.mutate,
    isRepaying: repayMutation.isPending,
    repayError: repayMutation.error,

    reset: () => {
      borrowMutation.reset();
      repayMutation.reset();
    },
  };
}
