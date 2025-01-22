import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { GetTransactions } from "liquidops";

type TransactionAction = GetTransactions["action"];

const TOKENS = ["QAR", "STETH", "DAI"] as const;
const ACTIONS: TransactionAction[] = ["borrow", "lend", "repay", "unLend"];
export function useTransactions() {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["allTransactions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const allTransactions = [];

      for (const token of TOKENS) {
        for (const action of ACTIONS) {
          const result = await LiquidOpsClient.getTransactions({
            token,
            action,
            walletAddress,
          });

          allTransactions.push(...result.transactions);
        }
      }

      // Filter out transactions without a tag timestamp and sort by tag timestamp (newest first)
      return allTransactions
        .filter((tx) => tx.tags?.timestamp)
        .sort((a, b) => {
          const timestampA = parseInt(a.tags.timestamp);
          const timestampB = parseInt(b.tags.timestamp);
          return timestampB - timestampA; // Switched order for descending (newest first)
        });
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
