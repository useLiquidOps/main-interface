import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { GetTransactions } from "liquidops";
import { useSupportedTokens } from "./useSupportedTokens";

type TransactionAction = GetTransactions["action"];

const ACTIONS: TransactionAction[] = ["borrow", "lend", "repay", "unLend"];
export function useTransactions() {
  const { data: walletAddress } = useWalletAddress();

  const { data: supportedTokens = [] } = useSupportedTokens();

  return useQuery({
    queryKey: ["allTransactions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet address not available");
      }

      const allTransactions = [];
      for (const token of supportedTokens) {
        for (const action of ACTIONS) {
          try {
            const result = await LiquidOpsClient.getTransactions({
              token: token["ticker"],
              action,
              walletAddress,
            });
            allTransactions.push(...result.transactions);
          } catch (error) {
            console.error(
              `Error fetching transactions for ${token} ${action}:`,
              error,
            );
          }
        }
      }

      const filteredTransactions = allTransactions
        .filter((tx) => tx.tags?.timestamp)
        .sort((a, b) => {
          const timestampA = parseInt(a.tags.timestamp);
          const timestampB = parseInt(b.tags.timestamp);
          return timestampB - timestampA;
        });
      return filteredTransactions;
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
