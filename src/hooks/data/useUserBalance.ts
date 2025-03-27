import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";
import {
  WrappedQuantity,
  unWrapQuantity,
  wrapQuantity,
} from "@/utils/cacheUtils";
import { getDenomination } from "@/utils/cacheUtils";
import { Quantity } from "ao-tokens";

export type UserBalanceCache = WrappedQuantity;

export function useUserBalance(tokenAddress: string, overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY =
    `user-balance-${tokenAddress}-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["user-balance", tokenAddress, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const checkCache = isDataCachedValid(DATA_KEY);

      if (checkCache && overrideCache === false) {
        return unWrapQuantity(checkCache);
      } else {
        const balance = await LiquidOpsClient.getBalance({
          tokenAddress,
          walletAddress,
        });

        const denomination = getDenomination(tokenAddress);
        if (denomination === undefined) {
          throw new Error(
            "Cannot find token address denomination in useUserBalance.ts",
          );
        }
        const scaledBalance = new Quantity(balance, denomination);

        const balanceCache = {
          dataKey: DATA_KEY,
          data: wrapQuantity(scaledBalance),
        };
        cacheData(balanceCache);

        return scaledBalance;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
