import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "./useWalletAddress";
import { useMemo } from "react";
import { cacheData, isDataCachedValid, unWrapQuantity, WrappedQuantity, wrapQuantity } from "@/utils/caches/cacheUtils";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { Quantity } from "ao-tokens";

export interface EarningsCache {
  base: WrappedQuantity;
  profit: WrappedQuantity;
}

interface Earnings {
  base: Quantity;
  profit: Quantity;
}

export function useEarnings(token: string, collateralization: Quantity, overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY = useMemo(
    () => `user-earnings-${token}-${walletAddress || ""}`,
    [walletAddress, token]
  );

  return useQuery({
    queryKey: ["user-earnings", token, walletAddress, DATA_KEY, overrideCache, collateralization],
    queryFn: async () => {
      if (!walletAddress || !collateralization) {
        return {
          profit: new Quantity(0n, collateralization?.denomination || 0n),
          base: new Quantity(0n, collateralization?.denomination || 0n),
        };
      }

      const checkCache = isDataCachedValid(DATA_KEY as `user-earnings-${string}-${string}`);
      let cache: Earnings | undefined;

      if (!!checkCache && !overrideCache) {
        cache = {
          profit: checkCache.profit ? unWrapQuantity(checkCache.profit) : new Quantity(0n, 0n),
          base: checkCache.base ? unWrapQuantity(checkCache.base) : new Quantity(0n, 0n),
        };
      }

      if (cache && Quantity.eq(collateralization, Quantity.__add(cache.base, cache.profit))) {
        return cache;
      } else {
        const earnings = await LiquidOpsClient.getEarnings({
          token,
          collateralization: collateralization.raw,
          walletAddress
        });
        const res = {
          profit: new Quantity(earnings.profit, collateralization.denomination),
          base: new Quantity(earnings.base, collateralization.denomination),
        };

        cacheData({
          dataKey: DATA_KEY,
          data: {
            profit: wrapQuantity(res.profit),
            base: wrapQuantity(res.base)
          }
        });
        return res;
      }
    },
    enabled: !!walletAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
