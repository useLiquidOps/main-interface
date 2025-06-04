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

  const DATA_KEY = useMemo(
    () => `user-earnings-${token}-${walletAddress || ""}`,
    [walletAddress, token],
  );

  return useQuery({
    queryKey: ["user-earnings", token, walletAddress, DATA_KEY, overrideCache],
    queryFn: async () => {
      if (!walletAddress) {
        return { profit: 0n, base: 0n };
      }

      const checkCache = isDataCachedValid(
        DATA_KEY as `user-earnings-${string}-${string}`,
      );

      if (!!checkCache && !overrideCache) {
        return {
          profit: BigInt(checkCache.profit),
          base: BigInt(checkCache.profit),
        };
      } else {
        const position = await LiquidOpsClient.getPosition({
          recipient: walletAddress,
          token,
        });
        const earnings = await LiquidOpsClient.getEarnings({
          token,
          collateralization: BigInt(position.collateralization),
          walletAddress,
        });

        cacheData({
          dataKey: DATA_KEY,
          data: {
            profit: earnings.base.toString(),
            base: earnings.base.toString(),
          },
        });
        return earnings;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
