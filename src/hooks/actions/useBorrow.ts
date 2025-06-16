import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { tokenInput, tokenData } from "liquidops";
import { PendingTxContext } from "@/components/PendingTransactions/PendingTransactions";
import { useContext } from "react";
import { Quantity } from "ao-tokens";
import { NotificationContext } from "@/components/notifications/NotificationProvider";
import { formatQty } from "@/utils/LiquidOps/tokenFormat";

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
  const [, setPendingTransactions] = useContext(PendingTxContext);
  const [, notify] = useContext(NotificationContext);

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

        return messageId;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (messageId, { token, quantity }) => {
      if (onSuccess) onSuccess();

      const ticker = token.toUpperCase();
      const qty = new Quantity(quantity, tokenData[ticker].denomination);

      const maximumFractionDigits = (
        Quantity.lt(qty, new Quantity(1n, 0n)) ? Number(qty.denomination) : 2
      ) as BigIntToLocaleStringOptions["maximumFractionDigits"];
      notify({
        type: "success",
        content:
          "You've borrowed " +
          qty.toLocaleString(undefined, { maximumFractionDigits }) +
          " " +
          ticker,
      });

      try {
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
            id: messageId,
            ticker: ticker,
            timestamp: Date.now(),
            qty: formatQty(qty),
            action: "borrow",
          },
        ]);
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

        return transferId;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async (transferId, { token, quantity }) => {
      if (onSuccess) onSuccess();

      const ticker = token.toUpperCase();
      const qty = new Quantity(quantity, tokenData[ticker].denomination);

      const maximumFractionDigits = (
        Quantity.lt(qty, new Quantity(1n, 0n)) ? Number(qty.denomination) : 2
      ) as BigIntToLocaleStringOptions["maximumFractionDigits"];
      notify({
        type: "success",
        content:
          "You've repaid " +
          qty.toLocaleString(undefined, { maximumFractionDigits }) +
          " " +
          ticker,
      });

      try {
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
            qty: formatQty(qty),
            action: "repay",
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
