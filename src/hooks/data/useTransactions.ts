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

      // Sort transactions by timestamp in descending order
      return allTransactions.sort((a, b) => {
        const timestampA = b.block?.timestamp || 0;
        const timestampB = a.block?.timestamp || 0;
        return timestampA - timestampB;
      });
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
