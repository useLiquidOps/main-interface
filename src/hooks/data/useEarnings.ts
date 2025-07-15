import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { useMemo } from "react";
import { cacheData, isDataCachedValid } from "@/utils/caches/cacheUtils";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";

export interface EarningsCache {
  base: string;
  profit: string;
}

export function useEarnings(token: string, overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  return useQuery({
    queryKey: ["user-earnings", token, walletAddress, overrideCache],
    queryFn: async () => {
      if (!walletAddress) {
        return { profit: 0n, base: 0n };
      }

      const position = await LiquidOpsClient.getPosition({
        recipient: walletAddress,
        token,
      });
      return await LiquidOpsClient.getEarnings({
        token,
        collateralization: BigInt(position.collateralization),
        walletAddress,
      });
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
