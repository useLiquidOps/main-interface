import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { useWalletAddress } from "./useWalletAddress";
import { GetTransactions, GetTransactionsRes } from "liquidops";

type UseTransactionsParams = Omit<GetTransactions, "walletAddress">;

export function useTransactions({
  token,
  action,
  cursor,
}: UseTransactionsParams) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["transactions", token, action, walletAddress, cursor],
    queryFn: async (): Promise<GetTransactionsRes> => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const transactions = await LiquidOpsClient.getTransactions({
        token,
        action,
        cursor,
        walletAddress,
      });

      return transactions;
    },
    // Only fetch when we have a wallet address
    enabled: !!walletAddress,
    // Add stale time to prevent too frequent refetches
    staleTime: 30 * 1000, // 30 seconds
    // Add cache time to keep data for
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
