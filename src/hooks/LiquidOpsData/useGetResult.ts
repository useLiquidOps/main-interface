import { useQuery } from "@tanstack/react-query";
import { LiquidOpsClient } from "@/utils/LiquidOps/LiquidOps";
import { GetResultRes } from "liquidops";
import { isDataCachedValid, cacheData } from "@/utils/caches/cacheUtils";

export type ResultCache = GetResultRes;

export function useGetResult(
  transferID: string,
  tokenAddress: string,
  action: "lend" | "unLend" | "borrow" | "repay",
  overrideCache?: boolean,
) {
  return useQuery({
    queryKey: ["result", transferID, tokenAddress, action],
    queryFn: async (): Promise<GetResultRes> => {
      const getResult = await LiquidOpsClient.getResult({
        transferID,
        tokenAddress,
        action,
      });

      return getResult;
    },
    enabled: !!transferID && !!tokenAddress && !!action,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
