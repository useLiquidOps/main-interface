import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { tokenData, tokenInput } from "liquidops";
import { Quantity } from "ao-tokens-lite";
import { PendingTxContext } from "@/components/PendingTransactions/PendingTransactions";
import { useContext } from "react";
import { NotificationContext } from "@/components/notifications/NotificationProvider";
import { formatQty } from "@/utils/LiquidOps/tokenFormat";

interface LendParams {
  token: string;
  quantity: bigint;
}

type UnlendParams = LendParams;

interface Params {
  onSuccess?: () => void;
}

export function useLend({ onSuccess }: Params = {}) {
  const queryClient = useQueryClient();
  const [, setPendingTransactions] = useContext(PendingTxContext);
  const [, notify] = useContext(NotificationContext);

  const lendMutation = useMutation({
    mutationFn: async ({ token, quantity }: LendParams) => {
      try {
        const walletAddress = await window.arweaveWallet.getActiveAddress();
        const transferId = await LiquidOpsClient.lend({
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
              Tags: [{ name: "Action", values: "Mint-Confirmation" }],
            },
            fail: {
              Target: walletAddress,
              Tags: [
                { name: "Action", values: ["Mint-Error", "Transfer-Error"] },
              ],
            },
          },
        });

        if (!res) {
          throw new Error(
            "Failed to find lend result onchain. Your action might have failed.",
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
          "You've lent " +
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
            action: "lend",
          },
        ]);
      } catch {}
    },
  });

  const unlendMutation = useMutation({
    mutationFn: async ({ token, quantity }: UnlendParams) => {
      try {
        const walletAddress = await window.arweaveWallet.getActiveAddress();
        const messageId = await LiquidOpsClient.unLend({
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
              Tags: [{ name: "Action", values: "Redeem-Confirmation" }],
            },
            fail: {
              Target: walletAddress,
              Tags: [{ name: "Action", values: "Redeem-Error" }],
            },
          },
        });

        if (!res) {
          throw new Error(
            "Failed to find unlend result onchain. Your action might have failed.",
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
          "You've withdrawn " +
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
            action: "unlend",
          },
        ]);
      } catch {}
    },
  });

  return {
    lend: lendMutation.mutate,
    isLending: lendMutation.isPending,
    lendError: lendMutation.error,

    unlend: unlendMutation.mutate,
    isUnlending: unlendMutation.isPending,
    unlendError: unlendMutation.error,

    reset: () => {
      lendMutation.reset();
      unlendMutation.reset();
    },
  };
}
