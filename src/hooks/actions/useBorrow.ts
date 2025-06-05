import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { tokenInput } from "liquidops";
import { invalidateData } from "@/utils/caches/cacheUtils";

interface BorrowParams {
  token: string;
  quantity: bigint;
}

type RepayParams = BorrowParams;

interface Params {
  onSuccess?: () => void;
}

export function useBorrow({ onSuccess }: Params = {}) {
  const queryClient = useQueryClient();

  const borrowMutation = useMutation({
    mutationFn: async ({ token, quantity }: BorrowParams) => {
      try {
        const walletAddress = await window.arweaveWallet.getActiveAddress();
        const messageId = await LiquidOpsClient.borrow({
          token,
          quantity,
          noResult: true,
        });

        const { oTokenAddress } = tokenInput(token);
        const res = await LiquidOpsClient.trackResult({
          process: oTokenAddress,
          message: messageId,
          match: {
            success: {
              Target: walletAddress,
              Tags: [{ name: "Action", values: "Borrow-Confirmation" }],
            },
            fail: {
              Target: walletAddress,
              Tags: [{ name: "Action", values: "Borrow-Error" }],
            },
          },
        });

        if (!res) {
          throw new Error(
            "Failed to find borrow result onchain. Your action might have failed.",
          );
        } else if (res.match === "fail") {
          const errorMessage =
            res.message.Tags.find((tag) => tag.name === "Error")?.value ||
            "Unknown error";

          throw new Error(errorMessage);
        }

        return "Borrowed assets";
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (_, { token }) => {
      if (onSuccess) onSuccess();

      try {
        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(token.toUpperCase());

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
      } catch {}
    },
  });

  const repayMutation = useMutation({
    mutationFn: async ({ token, quantity }: RepayParams) => {
      try {
        const walletAddress = await window.arweaveWallet.getActiveAddress();
        const transferId = await LiquidOpsClient.repay({
          token,
          quantity,
          noResult: true,
        });

        const { tokenAddress, oTokenAddress } = tokenInput(token);
        const res = await LiquidOpsClient.trackResult({
          process: tokenAddress,
          message: transferId,
          targetProcess: oTokenAddress,
          match: {
            success: {
              Target: walletAddress,
              Tags: [{ name: "Action", values: "Repay-Confirmation" }],
            },
            fail: {
              Target: walletAddress,
              Tags: [
                { name: "Action", values: ["Repay-Error", "Transfer-Error"] },
              ],
            },
          },
        });

        if (!res) {
          throw new Error(
            "Failed to find repay result onchain. Your action might have failed.",
          );
        } else if (res.match === "fail") {
          const errorMessage =
            res.message.Tags.find((tag) => tag.name === "Error")?.value ||
            "Unknown error";

          throw new Error(errorMessage);
        }

        return "Repaid assets";
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (_, { token }) => {
      if (onSuccess) onSuccess();

      try {
        // we need to fetch the wallet address here, because useMutation
        // will not use the up-to-date address, if we access it through
        // a hook/state (will use the value at render time)
        // @ts-expect-error
        const walletAddress = await arweaveWallet.getActiveAddress();
        const { tokenAddress } = tokenInput(token.toUpperCase());

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
