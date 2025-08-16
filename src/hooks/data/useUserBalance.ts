import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { WrappedQuantity } from "@/utils/caches/cacheUtils";
import { getDenomination } from "@/utils/caches/cacheUtils";
import { Quantity } from "ao-tokens-lite";
import { lqdTokenAddress } from "liquidops";

export type UserBalanceCache = WrappedQuantity;

export function useUserBalance(tokenAddress: string) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-balance", tokenAddress, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Wallet address not available");

      const balance = await LiquidOpsClient.getBalance({
        tokenAddress,
        walletAddress,
      });

      if (tokenAddress === lqdTokenAddress) {
        return new Quantity(balance.raw, 18n);
      }

      const denomination = getDenomination(tokenAddress);
      if (denomination === undefined) {
        throw new Error(
          "Cannot find token address denomination in useUserBalance.ts",
        );
      }
      return new Quantity(balance.raw, balance.denomination);
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
