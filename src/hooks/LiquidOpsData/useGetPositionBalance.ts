import { useQuery } from "@tanstack/react-query";
import { useWalletAddress } from "../data/useWalletAddress";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { Quantity } from "ao-tokens";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";
import { GetPositionRes } from "liquidops";

export type PositionCache = GetPositionRes;

export function useGetPositionBalance(
  tokenAddress: string,
  overrideCache?: boolean,
) {
  const { data: walletAddress } = useWalletAddress();

  const DATA_KEY =
    `user-position-balance-${tokenAddress}-${walletAddress || ""}` as const;

  return useQuery({
    queryKey: ["position-balance", tokenAddress, walletAddress],
    queryFn: async (): Promise<Quantity> => {
      if (!walletAddress) {
        throw new Error("Wallet address not available");
      }

      const cachedData = isDataCachedValid(DATA_KEY);

      let positionData: PositionCache;

      if (cachedData !== false && overrideCache !== true) {
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
        positionData.collateralization,
        BigInt(positionData.collateralDenomination),
      );
    },
    enabled: !!tokenAddress,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
