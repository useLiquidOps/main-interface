import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";
import {
  WrappedQuantity,
  unWrapQuantity,
  wrapQuantity,
} from "@/utils/cacheUtils";

export type UserBalanceCache = WrappedQuantity;

export function useUserBalance(tokenAddress: string) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY =
    `user-balance-${tokenAddress}-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["user-balance", tokenAddress, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache) {
        return unWrapQuantity(checkCache);
      } else {
        const balance = await LiquidOpsClient.getBalance({
          tokenAddress,
          walletAddress,
        });

        const balanceCache = {
          dataKey: DATA_KEY,
          data: wrapQuantity(balance),
        };
        cacheData(balanceCache);

        return balance;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
