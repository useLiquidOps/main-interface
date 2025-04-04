import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "../data/useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps";
import { Quantity } from "ao-tokens";
import { isDataCachedValid, cacheData } from "@/utils/cacheUtils";
import { GetPositionRes } from "liquidops";

export type PositionCache = GetPositionRes;

export function useGetPosition(tokenAddress: string, overrideCache?: boolean) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY =
    `user-position-${tokenAddress}-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["position", tokenAddress, walletAddress],
    queryFn: async (): Promise<Quantity> => {
      if (!walletAddress) {
        return new Quantity(0n, 12n);
      }

      const cachedData = isDataCachedValid(DATA_KEY);

      let positionData: PositionCache;

      if (cachedData && overrideCache === false) {
        positionData = cachedData;
      } else {
        positionData = await LiquidOpsClient.getPosition({
          token: tokenAddress,
          recipient: walletAddress,
        });

        cacheData({
          dataKey: DATA_KEY,
          data: positionData,
        });
      }

      return new Quantity(
        positionData.borrowBalance,
        BigInt(positionData.collateralDenomination),
      );
    },
    enabled: !!tokenAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
